# Architecture Notes — 002 Poems CRUD

## Components

```
Vue UI (Vite)
  └── App.vue  (adds router-view)
       ├── PlayList.vue  (Spec 001 — unchanged)
       └── PlayDetail.vue  (NEW — routed via /plays/:playId)
            ├── PoemList (inline — list of poems with edit/delete per item)
            └── CreatePoemForm (inline — title input + body textarea + submit)

Vue Router (NEW — src/client/router.ts)
  ├── /           → PlayList.vue
  └── /plays/:id  → PlayDetail.vue

Express API (Node.js + TypeScript)
  └── src/server/routes/poems.ts  (NEW — mounted at /plays/:playId/poems)
       ├── GET    /plays/:playId/poems
       ├── POST   /plays/:playId/poems
       ├── PATCH  /plays/:playId/poems/:id
       └── DELETE /plays/:playId/poems/:id

SQLite (better-sqlite3)
  └── poems table  (NEW — added in db.ts migration)
```

---

## APIs

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/plays/:playId/poems` | — | `Poem[]` ordered by `created_at DESC`, or 404 if play not found |
| `POST` | `/plays/:playId/poems` | `{ title: string, body?: string }` | `Poem` (201), 400 if title empty, 404 if play not found |
| `PATCH` | `/plays/:playId/poems/:id` | `{ title?: string, body?: string }` | `Poem` (200), 400/404 |
| `DELETE` | `/plays/:playId/poems/:id` | — | 204 or 404 |

`Poem` shape:
```ts
{
  id: number,
  play_id: number,
  title: string,
  body: string,       // empty string if not provided
  created_at: string  // ISO 8601
}
```

---

## Data Model

```sql
CREATE TABLE IF NOT EXISTS poems (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  play_id    INTEGER NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
  title      TEXT    NOT NULL,
  body       TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The `ON DELETE CASCADE` on `play_id` closes AC5 from Spec 001 — deleting a play removes all its poems automatically, with `PRAGMA foreign_keys = ON` already active from `db.ts`.

---

## Data Flow

1. User clicks a play name in `PlayList` → Vue Router navigates to `/plays/:id`
2. `PlayDetail` mounts → `GET /plays/:playId/poems` → renders poem list
3. Create: user fills title + body → `POST /plays/:playId/poems` → on success, re-fetch poem list
4. Edit: user clicks edit on a poem → inline form pre-filled → `PATCH /plays/:playId/poems/:id` → re-fetch
5. Delete: user clicks delete → `window.confirm()` → `DELETE /plays/:playId/poems/:id` → re-fetch
6. Play not found: API returns 404 → `PlayDetail` shows "Play not found" message

---

## Important Decisions

- **Nested route `/plays/:playId/poems`** — keeps poems scoped to their play in the URL; consistent with REST conventions and makes play ownership self-evident without a join in every query.
- **No separate poem detail route** — title + textarea on the play detail page is sufficient for this spec; a dedicated `/plays/:id/poems/:id` route is deferred until AI features (Spec 003) need it.
- **No title uniqueness constraint** — intentional per spec; poets may have multiple drafts with the same working title.
- **Vue Router added in this spec** — Spec 001 had a single-page app with no routing; navigation between list and detail view requires it now. `PlayList` is the index route `/`, `PlayDetail` is `/plays/:id`.

---

## Risks

- `db.ts` needs a second `CREATE TABLE IF NOT EXISTS` statement for `poems` — must run after `plays` table creation (order matters for the FK reference). Already structured sequentially in `db.ts`.
- Vue Router is a new dependency; `App.vue` must be updated to use `<router-view>` instead of directly rendering `<PlayList>` — this is the only change to Spec 001 files.
- Play-not-found on `GET /plays/:playId/poems` must check the play exists before querying poems — a missing play and an empty poem list must return different responses (404 vs empty array).
