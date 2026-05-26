# Spec 003: AI Review

## Goal

A user can request an AI review of a poem and receive grades across four aspects plus improvement suggestions, without the AI writing any poem content for them.

---

## User Value

Ana wants honest feedback on her poem but doesn't want to be told what to write. The AI review gives her a structured read of her work — numerical grades per dimension with a one-sentence rationale each, and improvement directions phrased as questions or prompts — so she can decide how to grow the poem herself.

---

## Requirements

- A user can trigger a review for any poem that has a non-empty body
- The review grades the poem across four aspects: **rhythm**, **imagery**, **emotion**, **structure**
- Each grade is a number from 1 to 5 with a one-sentence rationale
- The review includes 1–3 improvement suggestions, each phrased as a question or direction (never as rewritten content)
- The review result is persisted and displayed after the API call completes
- Requesting a new review replaces the existing one for that poem
- A poem with an empty body cannot be reviewed (rejected with a visible error)

---

## Acceptance Criteria

- [ ] A "Get Review" button is visible on the poem detail/edit view for poems with a non-empty body
- [ ] Clicking "Get Review" calls `POST /plays/:playId/poems/:id/review` and shows a loading state while waiting
- [ ] The response includes grades for all four aspects (rhythm, imagery, emotion, structure), each with a 1–5 score and a one-sentence rationale
- [ ] The response includes 1–3 suggestions, each phrased as a question or direction — no rewritten lines
- [ ] The review is displayed below the poem on the detail view after the call returns
- [ ] Requesting a review on a poem with an empty body returns 400 from the API with a visible error in the UI
- [ ] Requesting a new review replaces the previously displayed review (no accumulation)
- [ ] The last review for a poem is persisted and shown when revisiting the poem detail view

---

## Out of Scope

- Poet Comparison — covered in Spec 004
- Streaming the review response — full response only for MVP
- Review history / versioning — only the latest review is kept
- User ability to rate or dismiss the review
- Grading any aspects beyond the four named above

---

## Dependencies

- **Spec 001 — Plays CRUD** complete
- **Spec 002 — Poems CRUD** complete — poem detail view and `/plays/:playId/poems/:id` routes must exist
- **Anthropic API key** available as environment variable `ANTHROPIC_API_KEY`

---

## Risks

- LLM response parsing: the API call returns freeform text — the prompt must constrain the output to a parseable JSON shape; malformed responses must be handled gracefully
- Latency: Claude API calls may take 3–8 seconds — loading state in the UI is required
- API key absent: if `ANTHROPIC_API_KEY` is not set, the server should return 503 with a clear message rather than crashing
- Prompt quality: the suggestion constraint ("question or direction, never rewritten content") requires careful prompt wording; this is an iteration risk

---

## Notes

- The review is stored in a `reviews` table keyed by `poem_id` (one row per poem, upserted on each request)
- The Anthropic SDK is called server-side only — the API key is never exposed to the browser
- Prompt template lives in `src/server/ai/prompts/review.ts` as a plain string function — easy to iterate without touching route logic
- The poem detail view for this spec is the same `PlayDetail.vue` page used in Spec 002; a poem-level expand/detail panel is sufficient — no new route needed
