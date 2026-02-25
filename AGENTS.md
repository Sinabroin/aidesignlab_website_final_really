# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

AI Design Lab (AI 디자인랩) monorepo for Hyundai E&C. Two services:

| Service | Directory | Port | Dev command |
|---|---|---|---|
| Next.js frontend | `apps/web` | 3001 | `npm run dev` (from root) |
| FastAPI backend | `apps/api` | 8000 | `cd apps/api && uv run uvicorn app.main:app --reload --port 8000` |

### Running the frontend

```bash
npm run dev        # starts Next.js on port 3001
```

The frontend uses mock data when `DATABASE_URL` is not set. Pages that use server-side auth (`/community`, `/admin`, `/help-requests`) require a SQL Server `DATABASE_URL` because `lib/auth.ts` eagerly initializes `PrismaAdapter(getPrismaClient())`. The landing page (`/`) and playground hub (`/playground`) work without a database.

Set `AUTH_BYPASS_MIDDLEWARE=true` in `apps/web/.env.local` to skip middleware auth checks during development.

### Running the backend

```bash
cd apps/api && uv run uvicorn app.main:app --reload --port 8000
```

Backend defaults to SQLite (`sqlite:///./app.db`). Swagger docs available at `http://localhost:8000/docs`.

### Environment files

- `apps/web/.env.local` — frontend env (see `.env.local.example` at repo root)
- `apps/api/.env` — backend env (see `.env.example` at repo root)

Minimal dev `.env.local` for frontend:
```
AUTH_PROVIDER=dev
AUTH_BYPASS_MIDDLEWARE=true
SESSION_SECRET=dev-session-secret
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-for-local-development-only
```

### Linting

- **Frontend**: `next lint` has a known ESLint 9 + `next/core-web-vitals` circular structure bug (acknowledged in `next.config.js`). Use `npx tsc --noEmit` for type checking instead.
- **Backend**: `cd apps/api && uv run ruff check .` (existing lint warnings in the codebase are pre-existing, not introduced by setup).

### Tests

No automated test suites exist in this codebase currently.

### Prisma

Run `npx prisma generate` in `apps/web` after installing dependencies. The schema uses `sqlserver` provider — Prisma generate works without a database connection, but `prisma db push`/`migrate` requires an actual SQL Server.

### Package managers

- **Frontend**: `npm` with workspaces (no lockfile committed)
- **Backend**: `uv` with `uv.lock`
