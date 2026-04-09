# College Event Management & Approval Platform

This workspace contains a production-ready scaffold for a multi-tenant College Event Management & Approval SaaS app.

Tech stack (strict): React (Vite), TypeScript, Tailwind, Node.js, Express, Prisma, PostgreSQL, Docker.

Quickstart
1. Copy `.env.example` into `backend/.env` and set values.
2. Start local stack via `docker compose up --build`.
3. Enter backend container and run `npx prisma migrate dev` then `npm run seed`.
4. Start frontend dev server in `frontend/` (see `frontend/README.md`).

Security & Notes
- All data is scoped by `collegeId` in the DB; enforce tenant scoping in middleware and services.
- RBAC middleware skeleton is included; attach permissions to roles in seed or admin UI.

See `backend/README.md` and `frontend/README.md` for more details.
