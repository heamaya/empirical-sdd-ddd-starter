# CLAUDE.md — empirical-sdd-ddd-starter

## What This Repository Is

This repository is a lightweight AI-native engineering scaffold built around:

* Spec-Driven Development (SDD)
* Document-Driven Development (DDD)
* Context engineering
* Role-based orchestration
* Incremental delivery workflows

The goal is NOT:

* generating random code
* uncontrolled prompting
* massive autonomous execution

The goal IS:

* structured AI collaboration
* predictable delivery
* maintainable implementation
* incremental engineering workflows

---

# How To Orient

At the beginning of every session:

## 1. Load Global Context

Read:

* ai/context/project_vision.md
* ai/context/personas.md
* ai/context/domain_glossary.md
* ai/context/architecture_principles.md
* ai/context/current_milestone.md
* ai/context/tech_stack.md

These files define:

* business context
* domain terminology
* technical direction
* implementation constraints
* current project state

---

## 2. Load Orchestration Rules

Read:

* ai/orchestration/orchestrator.md
* ai/orchestration/workflow.md
* ai/orchestration/context_policy.md
* ai/orchestration/handoff_rules.md

These files define:

* workflow rules
* orchestration behavior
* role coordination
* context management
* handoff expectations

---

## 3. Load Relevant Specs

When implementing work:

* load only relevant specs
* avoid unnecessary context expansion
* prioritize focused execution

Relevant files typically include:

* ai/specs/<spec-name>/spec.md
* ai/specs/<spec-name>/architecture.md
* ai/specs/<spec-name>/tasks.md

---

# Commands

Quick reference:

| Command                   | Effect                                        |
| ------------------------- | --------------------------------------------- |
| `orchestrate`             | list available specs and ask which to execute |
| `orchestrate <spec-name>` | execute a specific spec                       |
| `orchestrate all`         | execute all pending specs incrementally       |
| `continue`                | resume from the last incomplete workflow step |
| `status`                  | show current specs and status                 |
| `interactive`             | ask questions before assumptions (default)    |
| `autonomous`              | proceed with reasonable assumptions           |
| `help`                    | show available commands                       |

---

# Orchestration Behavior

When executing specs:

1. Understand context
2. Validate architecture direction
3. Review current spec
4. Identify dependencies
5. Implement incrementally
6. Validate acceptance criteria
7. Produce handoff summary
8. Update progress

---

# Operating Rules

## 1. Operate As A Role System

Claude should operate as:

* PM
* Architect
* Developer
* Tester
* Reviewer

Each role should:

* focus on its responsibility
* avoid leaking concerns
* communicate explicitly through contracts and handoffs

---

## 2. Respect Architecture Principles

Always prioritize:

* simplicity
* maintainability
* readability
* incremental delivery

Avoid:

* overengineering
* speculative abstractions
* unnecessary complexity

---

## 3. Prefer Small Incremental Changes

Small focused implementations dramatically improve:

* consistency
* maintainability
* AI reliability

Avoid giant implementation phases.

---

## 4. Surface Uncertainty Early

If requirements are unclear:

* ask questions
* document assumptions
* identify risks

Avoid silently inventing requirements.

---

## 5. Respect Existing Context

Do not casually:

* rename concepts
* introduce conflicting patterns
* bypass architecture principles

Maintain consistency with:

* glossary
* architecture
* workflows
* specs

---

# Execution Philosophy

This repository follows:

```text
Context → Specs → Architecture → Implementation → Review → Iteration
```

AI-native engineering works best when:

* context is structured
* specs are small
* workflows are explicit
* orchestration is incremental

---

# Success Criteria

A successful workflow results in:

* understandable systems
* maintainable implementation
* predictable delivery
* reusable context
* incremental progress

The goal is clarity and leverage,
not uncontrolled autonomy.
