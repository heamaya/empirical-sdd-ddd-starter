# Tech Stack

## Frontend

- **Vue** (Vite) — component-based UI, fast dev loop
- **Vue Router** — client-side routing between plays and poems
- **TailwindCSS** — utility-first styling, mobile-friendly without a heavy component library

No state management library — React local state and fetch are sufficient for this scope.

---

## Backend

- **Node.js + Express** — lightweight REST API, easy to deploy as a single process
- **TypeScript** — type safety without JVM overhead; consistent language across stack

---

## Database

- **SQLite** (via `better-sqlite3`) — zero infrastructure, single file, sufficient for a single-user personal tool
- Schema: `plays`, `poems`, `reviews` tables

Migrate to PostgreSQL only if multi-user or hosted deployment is needed.

---

## AI Integration

- **Anthropic Claude API** (claude-sonnet-4-6) — used for poem Review and Poet Comparison
- Calls made server-side only — API key never exposed to the browser
- Prompt templates kept in `src/ai/prompts/` as plain strings — easy to iterate without code changes

---

## Infrastructure

- **Single deployable unit** — Express serves both the API and the built React static files
- **Railway** or **Render** for hosting (free tier sufficient for MVP)
- **Docker** optional — not required for initial delivery

---

## Dev Tooling

- **Vite** — frontend dev server with HMR
- **tsx** — run TypeScript server without compile step in development
- **ESLint + Prettier** — consistent formatting
