# Tasks — 002 Poems CRUD

## Backend

- [x] Add `poems` table migration to `src/server/db.ts` (after plays table, with FK + cascade)
- [x] Create `src/server/routes/poems.ts` router mounted at `/plays/:playId/poems`
- [x] Implement `GET /plays/:playId/poems` — 404 if play not found, else return poems ordered by `created_at DESC`
- [x] Implement `POST /plays/:playId/poems` — validate title non-empty, 404 if play not found, insert, return 201
- [x] Implement `PATCH /plays/:playId/poems/:id` — validate title non-empty if provided, 404 if poem not found, update, return 200
- [x] Implement `DELETE /plays/:playId/poems/:id` — 404 if poem not found, delete, return 204
- [x] Mount poems router in `src/server/index.ts`

## Frontend

- [x] Install and configure `vue-router` (`src/client/router.ts`): `/` → `PlayList.vue`, `/plays/:id` → `PlayDetail.vue`
- [x] Update `src/client/App.vue` to use `<router-view>` instead of `<PlayList>` directly
- [x] Update `PlayList.vue` — play name becomes a `<router-link>` to `/plays/:id`
- [x] Create `src/client/components/PlayDetail.vue`:
  - Fetches poems on mount via `GET /plays/:playId/poems`
  - Shows "Play not found" if API returns 404
  - Shows empty state if no poems: "Write your first poem"
  - Renders poem list with title, truncated body, edit and delete buttons
  - Inline create form: title input + body textarea + submit button
  - Inline edit form: pre-filled title + body, save on submit or cancel
  - Delete: `window.confirm()` before `DELETE`

## Validation

- [x] `POST /plays/:playId/poems` with empty title returns 400
- [x] `POST /plays/:playId/poems` with unknown `playId` returns 404
- [x] `GET /plays/:playId/poems` with unknown `playId` returns 404
- [x] `GET /plays/:playId/poems` with a valid play and no poems returns `[]`
- [x] `DELETE /plays/:id` (play) also removes its poems — verify via `GET /plays/:playId/poems` returning 404 after the play is deleted
- [x] `PATCH /plays/:playId/poems/:id` with unknown poem id returns 404
