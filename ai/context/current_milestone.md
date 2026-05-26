# Current Milestone

## Current Focus

Milestone 1 — MVP: core writing experience + AI review.

Deliver a working app where a user can organize poems in plays, write freely, and trigger an AI review. Poet Comparison is a stretch goal for this milestone.

---

## Planned Specs

| # | Name | Description | Priority |
|---|------|-------------|----------|
| 001 | Plays CRUD | Create, list, rename, delete plays | Must |
| 002 | Poems CRUD | Create, read, update, delete poems inside a play | Must |
| 003 | AI Review | On-demand grading and suggestions for a poem | Must |
| 004 | Poet Comparison | On-demand stylistic comparison to well-known poets | Should |

Target: 4 specs, each completable in a single focused session.

---

## Active Specs

None yet — context initialization in progress.

---

## Risks

- AI prompt design for Review needs iteration: grades must feel meaningful, not arbitrary
- Suggestion wording is tricky — must avoid generating content for the user
- LLM latency may feel slow on mobile; consider a loading state spec

---

## Open Questions

- Authentication strategy? (start with no auth — single-user local session; add auth in a later milestone)
- Persistence: SQLite for simplicity, or hosted Postgres? (SQLite first; migrate if needed)
- Which LLM provider? (Claude API via Anthropic SDK — already familiar; swap if needed)
- Should Review results be persisted, or generated fresh each time? (persist per-request to avoid re-billing)
