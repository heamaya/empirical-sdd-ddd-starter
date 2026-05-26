# Tasks — 001 Plays CRUD

## Backend

- [x] Initialize project: `package.json`, TypeScript config, Express app entry point (`src/index.ts`)
- [x] Set up SQLite connection with `better-sqlite3` (`src/db.ts`)
- [x] Create `plays` table migration (run at server startup if table absent)
- [x] Implement `GET /plays` — return all plays ordered by `created_at DESC`
- [x] Implement `POST /plays` — validate non-empty name, insert, return 201; return 400 on empty or duplicate
- [x] Implement `PATCH /plays/:id` — validate name, update, return 200; return 404 if not found
- [x] Implement `DELETE /plays/:id` — delete row, return 204; return 404 if not found
- [x] Map SQLite `SQLITE_CONSTRAINT` error to HTTP 400 with message `"A play with that name already exists"`

## Frontend

- [x] Initialize Vue + Vite project (`src/` under project root or `client/`)
- [x] Configure Vite proxy so `/plays` → `http://localhost:3000` in dev
- [x] Create `PlayList` component: fetches and displays plays on mount
- [x] Create `CreatePlayForm`: inline text input + submit button, clears on success, shows error on failure
- [x] Add inline rename: click play name → input pre-filled with current name → save on blur or Enter
- [x] Add delete button per play: show confirmation dialog before calling `DELETE /plays/:id`
- [x] Show empty state message when no plays exist ("Create your first play to get started")

## Validation

- [x] `POST /plays` with empty name returns 400 and does not insert a row
- [x] `POST /plays` with duplicate name returns 400 with readable message
- [x] `DELETE /plays/:id` with unknown id returns 404
- [x] `GET /plays` after creating two plays returns both, newest first
- [x] Deleting a play removes it from the `GET /plays` response
