# Tasks — 003 AI Review

## Backend

- [x] Add `@anthropic-ai/sdk` to `package.json` dependencies
- [x] Add `reviews` table migration to `src/server/db.ts` (after poems table, FK + cascade)
- [x] Create `src/server/ai/prompts/review.ts` — `buildReviewPrompt(title, body)` function
- [x] Create `src/server/ai/reviewPoem.ts` — Anthropic SDK call, JSON parse, strip markdown fences, error handling
- [x] Create `src/server/routes/reviews.ts`:
  - `POST /plays/:playId/poems/:id/review` — fetch poem, validate body non-empty, call `reviewPoem`, upsert, return Review
  - `GET /plays/:playId/poems/:id/review` — return persisted review or 404
- [x] Mount reviews router in `src/server/index.ts`
- [x] Return 503 if `ANTHROPIC_API_KEY` is not set (checked at request time, not at startup)

## Frontend

- [x] Extend `PlayDetail.vue` to show a "Get Review" button per poem when body is non-empty
- [x] On mount / poem expand: call `GET /plays/:playId/poems/:id/review` and display persisted review if present
- [x] Show loading state ("Reviewing…" / spinner) while POST is in flight
- [x] Render `ReviewPanel` inline: grades table (aspect | score | rationale) + suggestions list
- [x] Replace previous review display on new review (no accumulation)
- [x] Show visible error if API returns 400 (empty body) or 503 (no API key)

## Validation

- [x] `POST` with a poem that has an empty body returns 400
- [x] `POST` with a missing poem id returns 404
- [ ] `POST` with a valid poem returns a Review with all four aspects graded (1–5) and 1–3 suggestions
- [ ] Each suggestion is a question or direction — no line of the original poem is reproduced verbatim
- [x] `GET` after a successful POST returns the same review
- [x] A second `POST` replaces the review — `GET` returns the new one
- [ ] `DELETE /plays/:playId/poems/:id` (poem) also removes its review — verify via `GET .../review` returning 404
