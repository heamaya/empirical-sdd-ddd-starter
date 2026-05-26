# Architecture Notes — 003 AI Review

## Components

```
Vue UI (Vite)
  └── PlayDetail.vue  (Spec 002 — extended)
       └── PoemCard (inline expand per poem)
            ├── "Get Review" button  (visible when body non-empty)
            ├── Loading state ("Reviewing…")
            ├── ReviewPanel (grades table + suggestions list)
            └── Error message (400 empty body / 503 no API key)

Express API (Node.js + TypeScript)
  └── src/server/routes/reviews.ts  (NEW)
       └── POST /plays/:playId/poems/:id/review

  └── src/server/ai/prompts/review.ts  (NEW — prompt template)
  └── src/server/ai/reviewPoem.ts      (NEW — Anthropic SDK call + parse)

SQLite
  └── reviews table  (NEW — upsert keyed by poem_id)
```

---

## APIs

| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/plays/:playId/poems/:id/review` | — | `Review` (200), 400 if poem body empty, 404 if poem not found, 503 if API key absent |
| `GET` | `/plays/:playId/poems/:id/review` | — | `Review` (200) or 404 if no review exists yet |

`Review` shape:
```ts
{
  poem_id: number,
  grades: {
    rhythm:    { score: number, rationale: string },
    imagery:   { score: number, rationale: string },
    emotion:   { score: number, rationale: string },
    structure: { score: number, rationale: string }
  },
  suggestions: string[],   // 1–3 items
  created_at: string       // ISO 8601
}
```

---

## Data Model

```sql
CREATE TABLE IF NOT EXISTS reviews (
  poem_id    INTEGER PRIMARY KEY REFERENCES poems(id) ON DELETE CASCADE,
  grades     TEXT NOT NULL,       -- JSON blob: { rhythm, imagery, emotion, structure }
  suggestions TEXT NOT NULL,      -- JSON blob: string[]
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

One row per poem, `poem_id` is the primary key — natural upsert via `INSERT OR REPLACE`.

---

## Prompt Design

`src/server/ai/prompts/review.ts` exports a function `buildReviewPrompt(title: string, body: string): string` that returns a prompt instructing Claude to:

1. Grade the poem on rhythm, imagery, emotion, and structure (1–5 each, one-sentence rationale)
2. Provide 1–3 improvement suggestions phrased as questions or directions — never rewrite lines
3. Return **only** a JSON object matching the `grades` + `suggestions` shape — no prose outside the JSON

Example output shape the prompt enforces:
```json
{
  "grades": {
    "rhythm":    { "score": 3, "rationale": "The meter is mostly consistent but breaks in the third stanza." },
    "imagery":   { "score": 4, "rationale": "Strong visual contrasts throughout." },
    "emotion":   { "score": 5, "rationale": "The closing couplet lands with real weight." },
    "structure": { "score": 3, "rationale": "The volta feels abrupt; the turn could be better prepared." }
  },
  "suggestions": [
    "What would happen if the third stanza matched the rhythm of the first?",
    "Could the volta be signalled earlier — perhaps with a shift in imagery?"
  ]
}
```

---

## Data Flow

1. User clicks "Get Review" → UI shows loading state → `POST /plays/:playId/poems/:id/review`
2. Server: fetch poem from DB → validate body non-empty → call Claude API → parse JSON response
3. Server: upsert into `reviews` table → return `Review` object
4. UI: render `ReviewPanel` with grades table and suggestions list; replace any previous review shown
5. On revisit: `GET /plays/:playId/poems/:id/review` on poem expand → render persisted review (or nothing if none)

---

## Important Decisions

- **POST triggers and persists in one call** — avoids a separate "save" step; the client always gets back a Review object and can display it directly. GET is only for loading a persisted review on revisit.
- **JSON-only prompt output** — asking Claude to return pure JSON (no prose wrapper) makes parsing deterministic. A try/catch wraps the parse; malformed output → 500 with a log.
- **`INSERT OR REPLACE` upsert** — SQLite's simplest upsert; replaces the whole row on re-review. No history kept, consistent with the spec.
- **Prompt in its own file** — `src/server/ai/prompts/review.ts` isolates the prompt string from route logic, so prompt iteration does not touch `reviews.ts`.
- **No streaming** — `client.messages.create` with full response; simpler parse, acceptable latency for MVP.

---

## Risks

- **JSON parse failure**: Claude occasionally adds markdown fences or prose. Mitigation: strip leading/trailing ``` blocks before `JSON.parse`; if parse still fails, return 500 with `{ error: "Review parsing failed — try again" }`.
- **Missing API key**: check `process.env.ANTHROPIC_API_KEY` at request time; return 503 `{ error: "AI features unavailable — ANTHROPIC_API_KEY not configured" }` without attempting the SDK call.
- **Cascade delete**: `reviews` FK references `poems(id) ON DELETE CASCADE` — deleting a poem removes its review automatically (consistent with the cascade pattern from Specs 001–002).
