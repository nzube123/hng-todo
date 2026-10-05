# Todo + Notes

A focused productivity app built with React, TypeScript, Vite, Tailwind CSS, Express, Prisma, SQLite, and Zod.

## Requirements

- Node.js 20 or newer
- pnpm 9

## Start from a fresh checkout

```sh
git clone <repository>
cd todo-app
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173). The API runs at http://localhost:5000. SQLite is created automatically at `apps/api/prisma/dev.db`; no database server or manual environment setup is needed. The root `.env.example` documents the default configuration; the API also supplies the local defaults when environment variables are absent.

## Commands

- `pnpm dev` — run API and frontend together
- `pnpm build` — production-build both applications
- `pnpm lint` — lint workspace source and configuration
- `pnpm typecheck` — strict TypeScript checks
- `pnpm db:generate` — generate Prisma Client
- `pnpm db:migrate` — apply the SQLite migration and create the database

Todo and note data persist in the local SQLite database. API responses use `{ "success": true, "data": ... }` on success and a user-safe error envelope on failure.
