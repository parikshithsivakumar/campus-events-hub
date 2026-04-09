# Deploy & Build Steps (Production)

1. Provision infrastructure:
   - Managed Postgres (Neon/Supabase/Railway)
   - Managed object storage (S3)
   - Redis (for caching and job queue)
   - CI runner

2. Build backend image:
   - Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and S3/SMTP envs in your secret store.
   - Run `npm ci && npm run build` and push the image to your registry.

3. Database migrations:
   - Run `npx prisma migrate deploy` in production.
   - Run the seed script only for initial provisioning (do not run repeatedly in prod).

4. Run migrations and start containers:
   - Use Kubernetes / ECS with horizontal autoscaling.
   - Configure health checks: `/health` and readiness probes.

5. Observability & Monitoring:
   - Add metrics scraping and alerts for errors, latency, and saturation.

6. Security checklist:
   - Ensure TLS termination and secure headers.
   - Rotate keys and credentials using a secrets manager.
