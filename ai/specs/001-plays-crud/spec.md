# Spec 001: Plays CRUD

## Goal

A user can create, rename, and delete plays so they can organize their poems into named collections.

---

## User Value

Ana and Marco need a way to group poems by theme or project. Without plays, all poems live in a flat unstructured list that becomes unmanageable over time.

---

## Requirements

- A user can create a play by providing a name
- A user can view the list of all their plays
- A user can rename an existing play
- A user can delete a play (with confirmation prompt in UI)
- A play name must be non-empty and unique per user session
- Deleting a play also deletes its poems (cascade)

---

## Acceptance Criteria

- [ ] A play can be created with a non-empty name and appears immediately in the list
- [ ] Attempting to create a play with an empty name is rejected with a visible error
- [ ] A play can be renamed; the updated name reflects immediately in the list
- [ ] A play can be deleted; it no longer appears in the list after deletion
- [ ] Deleting a play with poems removes those poems from the database (verified via direct DB query or a subsequent API call returning 404)
- [ ] `GET /plays` returns an array of all plays ordered by creation date descending

---

## Out of Scope

- Authentication — no user identity in this spec; single-session local user only
- Poem management inside a play — covered in Spec 002
- Ordering or reordering plays manually
- Play descriptions or metadata beyond `name`

---

## Dependencies

None — this is the foundation spec.

---

## Risks

- Cascade delete on poems could destroy data unexpectedly if triggered by mistake; a confirmation dialog in the UI is required but does not protect against direct API calls — acceptable for MVP scope
- SQLite file location needs to be consistent between dev and prod; must be documented in setup notes

---

## Notes

- Play name uniqueness is enforced at the database level (UNIQUE constraint) and surfaced as a user-visible error, not a silent failure
- This spec delivers only the data layer and API; the UI is a minimal list with inline create/rename/delete actions — no separate page needed
