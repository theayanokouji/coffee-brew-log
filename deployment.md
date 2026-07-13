# Deployment

> **Live URL:** _not yet deployed — see notes below._

## Recommended: Render.com (free tier)

### Backend (Node Web Service)

1. New → Web Service → connect repo.
2. Root directory: `backend`
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
4. Start command: `npm start`
5. Environment variables:
   - `DATABASE_URL=file:./dev.db` (SQLite; note that Render's free tier disk is ephemeral — for durable storage attach a Render Disk mounted at `/var/data` and set `DATABASE_URL=file:/var/data/dev.db`, or switch the Prisma provider to Postgres).
   - `PORT=10000` (Render's default) — Express reads `process.env.PORT`.
   - `CORS_ORIGIN=https://<your-frontend>.onrender.com`

### Frontend (Static Site)

1. New → Static Site → same repo.
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://<your-backend>.onrender.com`

## Troubleshooting notes

- **SQLite data disappears between deploys on free Render** — attach a Render
  Disk, or migrate to Postgres by changing `provider = "postgresql"` in
  `backend/prisma/schema.prisma` and pointing `DATABASE_URL` at a hosted
  Postgres instance (Render, Neon, Supabase).
- **CORS errors** — make sure `CORS_ORIGIN` on the backend exactly matches the
  deployed frontend origin (scheme + host, no trailing slash).
- **`prisma: command not found` on Render** — the build command above uses
  `npx prisma …`, which resolves the local dev-dependency copy.