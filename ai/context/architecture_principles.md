# Architecture Principles

## Core Principles

- Keep solutions simple
- Prefer readability over cleverness
- Small incremental delivery
- Avoid overengineering
- Clear boundaries between layers
- Prefer maintainability over perfection
- Favor composability

---

## Delivery Philosophy

Prefer:
- small specs (one screen, one slice)
- iterative delivery — ship plays before poems before AI features
- vertical slices — each spec is end-to-end usable
- simple REST APIs — no GraphQL, no RPC
- understandable systems — a new engineer should orient in 30 minutes

Avoid:
- giant upfront architecture
- premature optimization
- speculative abstractions (e.g., plugin system for AI providers before there is a second provider)
- unnecessary microservices — this is a monolith until proven otherwise

---

## Domain Boundaries

```
User
 └── Play (folder)
      └── Poem (title + body)
           └── Review (grades + suggestions)  [on-demand, AI]
           └── PoetComparison (names + explanation)  [on-demand, AI]
```

- Plays own Poems. A poem without a play does not exist.
- Review and PoetComparison are stateless AI results — they may be stored for display but are not the source of truth for the poem.
- AI features call an external LLM; they do not modify the poem content.

---

## AI-Native Principles

AI performs significantly better when:
- context is structured
- terminology is consistent (see `domain_glossary.md`)
- specs are focused
- workflows are incremental

The repository structure exists to improve AI consistency and collaboration.

---

## AI Feature Constraints

- AI never generates poem text or autocompletes user content
- AI features are triggered explicitly by the user (button/action)
- Suggestions are phrased as questions or directions, not as rewrites
- Grades are numerical (1–5) per aspect, with a one-sentence rationale each
- Poet Comparison names 1–3 poets with a brief stylistic explanation
