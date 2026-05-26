# Spec 002: Poems CRUD

## Goal

A user can create, edit, and delete poems inside a play so they can write and manage their work within a named collection.

---

## User Value

Ana needs a place to write her poems. A play without poems is just a folder — this spec makes the app usable: the user can open a play, see its poems, write new ones, edit them freely, and remove ones they no longer want.

---

## Requirements

- A user can open a play and see the list of poems it contains
- A user can create a new poem inside a play by providing a title and a body
- A user can edit an existing poem's title and body
- A user can delete a poem from a play
- A poem title must be non-empty; the body may be empty
- Poem titles do not need to be unique within a play
- Deleting a play (Spec 001) cascades and removes its poems

---

## Acceptance Criteria

- [ ] `GET /plays/:playId/poems` returns all poems in that play ordered by `created_at DESC`
- [ ] A poem can be created with a non-empty title and any body (including empty); it appears immediately in the list
- [ ] Attempting to create a poem with an empty title is rejected with a visible error
- [ ] A poem's title and body can be edited; changes reflect immediately in the list/view
- [ ] A poem can be deleted; it no longer appears in the list after deletion
- [ ] Navigating to a play that does not exist returns 404 from the API
- [ ] Deleting a play via `DELETE /plays/:id` also removes all its poems (cascade — closes AC5 from Spec 001)

---

## Out of Scope

- AI Review or Poet Comparison — covered in Spec 003 and Spec 004
- Poem ordering or drag-to-reorder
- Poem search or filtering
- Rich text / markdown rendering — plain textarea only
- Versioning or draft history

---

## Dependencies

- **Spec 001 — Plays CRUD** must be complete. The `plays` table and `/plays` API must exist. The `DELETE /plays/:id` cascade constraint is set up in this spec.

---

## Risks

- SQLite foreign key cascade requires `PRAGMA foreign_keys = ON` — already enabled in `db.ts` from Spec 001; this spec adds the `poems` table with the cascade constraint and confirms it works end-to-end
- Editing a poem requires an open text area — mobile UX could be awkward on small screens, but acceptable for MVP scope (plain textarea, no special handling)
- The poem body can be large; no size limit is enforced — acceptable for a personal single-user tool

---

## Notes

- Poem title uniqueness is intentionally NOT enforced — a poet may have multiple drafts with the same working title
- The poem editor is a simple two-field form (title input + body textarea) on the play detail page — no separate route needed for this spec
- This spec confirms and closes the cascade delete deferred from Spec 001 AC5
