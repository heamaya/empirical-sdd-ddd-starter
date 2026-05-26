# Architecture Notes — 004 Poet Comparison

## Components

```
Vue UI (Vite)
  └── PlayDetail.vue  (Spec 002/003 — extended again)
       └── PoemCard (per poem)
            ├── "Compare Poets" button  (visible when body non-empty)
            ├── Loading state ("Comparing…")
            ├── ComparisonPanel (list of poet entries: name + explanation)
            └── Error message (400 empty body / 503 AWS credentials)

Express API (Node.js + TypeScript)
  └── src/server/routes/comparisons.ts  (NEW)
       ├── POST /plays/:playId/poems/:poemId/comparison
       └── GET  /plays/:playId/poems/:poemId/comparison

  └── src/server/ai/prompts/comparison.ts  (NEW — prompt template)
  └── src/server/ai/comparePoet.ts         (NEW — Bedrock call + parse)

SQLite
  └── comparisons table  (NEW — upsert keyed by poem_id)
```

---

## APIs

| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/plays/:playId/poems/:poemId/comparison` | — | `Comparison` (200), 400 if body empty, 404 if poem not found, 503 if AWS credentials missing |
| `GET`  | `/plays/:playId/poems/:poemId/comparison` | — | `Comparison` (200) or 404 if none exists |

`Comparison` response shape:
```ts
{
  poem_id: number,
  poets: PoetEntry[],   // 1–3 items
  created_at: string    // ISO 8601
}

type PoetEntry = {
  name: string          // well-known poet's name
  explanation: string   // 2–3 sentence stylistic similarity
}
```

---

## Data Model

```sql
CREATE TABLE IF NOT EXISTS comparisons (
  poem_id    INTEGER PRIMARY KEY REFERENCES poems(id) ON DELETE CASCADE,
  poets      TEXT NOT NULL,       -- JSON blob: PoetEntry[]
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

One row per poem, `poem_id` is the primary key — natural upsert via `INSERT OR REPLACE`. Same pattern as `reviews`.

---

## Prompt Design

`src/server/ai/prompts/comparison.ts` exports `buildComparisonPrompt(title: string, body: string): string` that instructs Claude to:

1. Identify 1–3 well-known, widely recognised poets whose style the poem resembles
2. For each, provide a name and a 2–3 sentence explanation of the specific stylistic similarity
3. Name only poets the reader is likely to know — no obscure or hallucinated names
4. Return **only** a JSON array (no markdown fences, no prose outside JSON) matching this shape:

```json
[
  {
    "name": "Emily Dickinson",
    "explanation": "The compressed line breaks and slant rhyme echo Dickinson's telegraphic style. The poem's meditation on mortality shares her tendency to treat death as a quiet domestic visitor. The dashes — used here for breath rather than grammar — are a direct kinship."
  }
]
```

---

## Data Flow

1. User clicks "Compare Poets" → loading state → `POST /plays/:playId/poems/:poemId/comparison`
2. Server: fetch poem → validate body non-empty → call `comparePoet` → parse JSON
3. Server: upsert into `comparisons` → return `Comparison` object
4. UI: render `ComparisonPanel` with poet list; replace any previous comparison shown
5. On revisit: `GET .../comparison` on poem expand → render persisted comparison (or nothing)

---

## Important Decisions

- **Parallel to `/review`, not nested under it** — comparisons are an independent AI feature; they share the same poem but have no dependency on a review existing. Separate endpoint keeps them independently triggerable.
- **JSON array at root** (not `{ poets: [...] }`) — the prompt returns the array directly; the route wraps it in the `Comparison` envelope before persisting and returning. Simpler prompt, cleaner parse.
- **Reuse `AnthropicBedrock` client pattern from Spec 003** — no new client setup; `comparePoet.ts` follows `reviewPoem.ts` exactly (import, instantiate, call, strip fences, parse, typed errors).
- **`INSERT OR REPLACE` upsert** — same as `reviews`; only the latest comparison is kept.

---

## Risks

- **JSON parse failure**: same mitigation as Spec 003 — strip markdown fences before `JSON.parse`; on failure throw `{ type: 'parse_error' }` → 500.
- **AWS credential errors**: catch `message` containing `credential` / `ExpiredToken` / `UnrecognizedClient` → 503. Same pattern as `reviews.ts`.
- **Cascade delete**: `comparisons.poem_id` FK with `ON DELETE CASCADE` — deleting a poem removes its comparison automatically.
- **`PlayDetail.vue` growth**: this is the third extension to `PlayDetail.vue`. The component is getting longer but remains a single concern (poem detail view). No refactor needed for this spec — note it for a future cleanup spec if it grows further.
