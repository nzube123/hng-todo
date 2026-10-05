# Todo + Notes

A focused productivity app built with React, TypeScript, Vite, Tailwind CSS, Express, Prisma, PostgreSQL, and Zod.

## Requirements

- Node.js 20 or newer
- pnpm 9
- PostgreSQL 14 or newer, running locally or remotely

## Start from a fresh checkout

```sh
git clone <repository>
cd todo-app
pnpm install
cp .env.example .env
# Configure DATABASE_URL in .env and create the PostgreSQL database first.
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Before starting, run PostgreSQL and create a database (for example, `createdb todo_app`), then set `DATABASE_URL` in `.env` to credentials that can access it, such as `postgresql://<user>:<password>@localhost:5432/todo_app?schema=public`. The database must exist before migration. Both the API and Prisma scripts load the root `.env` automatically. Open the Vite URL shown in the terminal (normally http://localhost:5173); the API runs at http://localhost:5000.

## Commands

- `pnpm dev` — run API and frontend together
- `pnpm build` — production-build both applications
- `pnpm lint` — lint workspace source and configuration
- `pnpm typecheck` — strict TypeScript checks
- `pnpm db:generate` — generate Prisma Client
- `pnpm db:migrate` — apply PostgreSQL migrations to the configured database

Todo and note data persist in PostgreSQL. The interface supports light and dark themes and remembers the chosen theme in the browser. API responses use `{ "success": true, "data": ... }` on success and a user-safe error envelope on failure.
