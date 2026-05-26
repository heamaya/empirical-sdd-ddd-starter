# Spec 004: Poet Comparison

## Goal

A user can request a stylistic comparison for a poem and receive 1–3 well-known poets whose style resembles theirs, each with a brief explanation of why.

---

## User Value

Marco wants to know which famous poets he writes like — not to imitate them, but to discover writers worth reading and to understand his own voice. The comparison gives him a mirror: it names poets and explains the specific stylistic similarities so he can explore further on his own.

---

## Requirements

- A user can trigger a poet comparison for any poem that has a non-empty body
- The result names 1–3 well-known poets whose style the poem resembles
- Each poet entry includes a brief explanation (2–3 sentences) of the stylistic similarity
- The comparison result is persisted and displayed after the API call completes
- Requesting a new comparison replaces the existing one for that poem
- A poem with an empty body cannot be compared (rejected with a visible error)

---

## Acceptance Criteria

- [ ] A "Compare Poets" button is visible on the poem view for poems with a non-empty body
- [ ] Clicking "Compare Poets" calls `POST /plays/:playId/poems/:id/comparison` and shows a loading state while waiting
- [ ] The response names 1–3 poets, each with a name and a 2–3 sentence stylistic explanation
- [ ] The comparison is displayed below the poem (alongside or after the review panel if one exists)
- [ ] Requesting a comparison on a poem with an empty body returns 400 with a visible error in the UI
- [ ] Requesting a new comparison replaces the previously displayed one (no accumulation)
- [ ] The last comparison for a poem is persisted and shown when revisiting the poem detail view

---

## Out of Scope

- AI Review (grades) — covered in Spec 003
- Linking poet names to external resources (Wikipedia, etc.)
- User ability to save, dismiss, or rate the comparison
- Comparing style across multiple poems at once

---

## Dependencies

- **Spec 001 — Plays CRUD** complete
- **Spec 002 — Poems CRUD** complete — poem detail view must exist
- **Spec 003 — AI Review** complete — Bedrock client pattern (`AnthropicBedrock`) and server-side AI call structure already established; follow the same pattern

---

## Risks

- LLM response parsing: same risk as Spec 003 — prompt must constrain output to parseable JSON; malformed responses handled gracefully
- Poet name accuracy: Claude may hallucinate obscure poets; the prompt should instruct it to name only widely recognised poets — acceptable risk for MVP, no verification layer
- Latency: same 3–8 second window as Spec 003 — loading state required
- AWS credential errors surface the same way as Spec 003 — reuse the same catch pattern

---

## Notes

- Comparison stored in a `comparisons` table keyed by `poem_id` (one row per poem, upserted on each request) — same pattern as `reviews`
- Prompt template in `src/server/ai/prompts/comparison.ts` — isolated from route logic, easy to iterate
- Bedrock client reused from Spec 003 (`AnthropicBedrock`, model `us.anthropic.claude-haiku-4-5-20251001-v1:0`)
- No new route prefix needed — comparisons live at `/plays/:playId/poems/:id/comparison`, parallel to `/review`
