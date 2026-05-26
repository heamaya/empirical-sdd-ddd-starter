# Tasks — 004 Poet Comparison

## Backend

- [x] Add `comparisons` table migration to `src/server/db.ts` (after reviews table, FK + cascade)
- [x] Create `src/server/ai/prompts/comparison.ts` — `buildComparisonPrompt(title, body)` function
- [x] Create `src/server/ai/comparePoet.ts` — Bedrock call, JSON array parse, strip markdown fences, typed errors (`parse_error`)
- [x] Create `src/server/routes/comparisons.ts`:
  - `POST /:poemId/comparison` — fetch poem, validate body non-empty, call `comparePoet`, upsert, return Comparison
  - `GET  /:poemId/comparison` — return persisted comparison or 404
- [x] Mount comparisons router in `src/server/index.ts` at `/plays/:playId/poems`

## Frontend

- [x] Extend `PlayDetail.vue` to show a "Compare Poets" button per poem when body is non-empty
- [x] On mount: call `GET .../comparison` for each poem with a body and display persisted comparison if present
- [x] Show loading state ("Comparing…") while POST is in flight
- [x] Render `ComparisonPanel` inline: list of poet entries (name bold + explanation paragraph)
- [x] Replace previous comparison display on new request (no accumulation)
- [x] Show visible error if API returns 400 (empty body) or 503 (AWS credentials)

## Validation

- [ ] `POST` with a poem that has an empty body returns 400
- [ ] `POST` with a missing poem id returns 404
- [ ] `POST` with a valid poem returns a Comparison with 1–3 poet entries, each with a name and explanation
- [ ] `GET` after a successful POST returns the same comparison
- [ ] A second `POST` replaces the comparison — `GET` returns the new one
- [ ] `DELETE /plays/:playId/poems/:id` (poem) also removes its comparison — verify via `GET .../comparison` returning 404
