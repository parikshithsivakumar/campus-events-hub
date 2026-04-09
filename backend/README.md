# Backend — College Event Management

Quick commands
- Install: `npm ci`
- Dev: `npm run dev`
- Migrations: `npm run prisma:migrate`
- Seed: `npm run seed`

Main endpoints
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/colleges` (authenticated)
- GET `/api/events`
- POST `/api/events`
- POST `/api/events/:id/approve`

Security & multi-tenant
- Use the `authenticate` middleware to get `req.user` with `collegeId`.
- All `findMany` / `create` queries must include `collegeId` scoping.
- Soft deletes are implemented via `deleted` boolean — queries should filter it out.

Production considerations
- Add rate-limiting (e.g. `express-rate-limit`), WAF, input validation at schema level.
- Use managed Postgres (Neon/Supabase/Railway) and S3 compatible storage for attachments.
- Enable logging and structured observability (OpenTelemetry).
