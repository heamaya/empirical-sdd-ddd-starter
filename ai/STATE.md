# State

Single source of truth for "where are we right now." Keep this file small (~50 lines max). Older history belongs in git or in `ai/specs/<spec-id>/notes.md`.

---

## Header

```
current_spec:    004-poet-comparison
current_role:    none
current_phase:   done
mode:            hitl
started_at:      2026-05-26
```

---

## Recent decisions (rolling — keep last 5 only)

Format: `YYYY-MM-DD | role | decision`

- 2026-05-26 | reviewer | 003-ai-review DONE — all risks addressed, no regressions, API key server-side only
- 2026-05-26 | analyst | spec 004-poet-comparison drafted — 1–3 poets + explanation, persisted, Bedrock pattern reused
- 2026-05-26 | pm | gate passed — 7 ACs clean, dependency on Spec 003 explicit
- 2026-05-26 | architect | gate passed — mirrors Spec 003 pattern, JSON array at root, no new abstractions
- 2026-05-26 | developer | gate passed — all tasks complete, no deviations
- 2026-05-26 | tester | SEND-BACK resolved — import fixed; all 7 ACs pass with live Bedrock calls
- 2026-05-26 | reviewer | 004-poet-comparison DONE — all risks addressed, Spec 003 intact, component maintainable

---

## Open send-backs

Format: `from <role> → to <role> | reason | spec`

- _none_

---

## Notes

- This file is read at the start of every `/sdd-orchestrate` invocation.
- The orchestrator updates it after every phase transition.
- When the rolling log fills, drop the oldest entry — don't grow this file.
- If you find yourself wanting more history here, you actually want `ai/specs/<spec-id>/notes.md` or git log.
