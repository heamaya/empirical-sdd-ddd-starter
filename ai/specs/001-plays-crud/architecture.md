# Architecture Notes — 001 Plays CRUD

## Components

```
Vue UI (Vite)
  └── PlayList component
       ├── CreatePlayForm (inline input + submit)
       ├── PlayItem (name, rename button, delete button)
       └── fetch() calls → Express REST API

Express API (Node.js + TypeScript)
  └── /plays router
       ├── GET    /plays
       ├── POST   /plays
       ├── PATCH  /plays/:id
       └── DELETE /plays/:id

SQLite (better-sqlite3)
  └── plays table
```

---

## APIs

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/plays` | — | `Play[]` ordered by `created_at DESC` |
| `POST` | `/plays` | `{ name: string }` | `Play` (201) or 400 if name empty/duplicate |
| `PATCH` | `/plays/:id` | `{ name: string }` | `Play` (200) or 400/404 |
| `DELETE` | `/plays/:id` | — | 204 or 404 |

`Play` shape:
```ts
{
  id: number,
  name: string,
  created_at: string  // ISO 8601
}
```

---

## Data Model

```sql
CREATE TABLE plays (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

Cascade delete on poems handled in Spec 002 when the `poems` table is created (`FOREIGN KEY (play_id) REFERENCES plays(id) ON DELETE CASCADE`). For this spec, deleting a play with no poems is the tested path; the constraint is set up now for forward compatibility.

---

## Data Flow

1. User types play name → `CreatePlayForm` submits `POST /plays`
2. API validates: non-empty, not duplicate → inserts row → returns `Play`
3. UI appends new play to top of list (optimistic or re-fetch)
4. Rename: user clicks edit icon → inline input → `PATCH /plays/:id` → UI updates name in place
5. Delete: user clicks delete → confirmation dialog → `DELETE /plays/:id` → UI removes item

---

## Important Decisions

- **SQLite over Postgres** — zero infrastructure for MVP; single file, sufficient for a personal single-user tool. Migrate if multi-user ever needed.
- **UNIQUE at DB level** — name uniqueness enforced by the database, not just application code. Avoids race conditions and keeps validation authoritative.
- **No soft delete** — plays are hard-deleted. Simplicity over recoverability at MVP scope.
- **Single router file** — `src/routes/plays.ts` keeps all play logic in one place; no service layer until complexity justifies it.

---

## Risks

- SQLite `UNIQUE` constraint returns a generic error code (`SQLITE_CONSTRAINT`); the API must map it to a meaningful 400 response with a user-readable message
- Cascade delete is not yet testable in this spec (no poems table); document the expectation in a comment in the migration for Spec 002 to pick up
