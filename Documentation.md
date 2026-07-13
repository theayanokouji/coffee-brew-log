# Coffee Brew Log

A tiny full-stack app for logging coffee brews from a hipster micro-roastery.
Create, list, filter, edit, and delete brew entries.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **ORM / DB:** Prisma + SQLite
- **Validation:** Zod (server), native HTML + JS validation (client)

## Repo layout

```
.
├── backend/     # Express + Prisma + SQLite JSON API
├── frontend/    # React + Vite + Tailwind SPA
├── Documentation.md
└── deployment.md
```

## Prerequisites

- Node.js 20+
- npm (or pnpm / bun)

## 1. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init   # creates SQLite DB + tables
npm run dev                          # http://localhost:4000
```

### Environment variables (`backend/.env`)

| Var           | Default                    | Purpose                        |
| ------------- | -------------------------- | ------------------------------ |
| `DATABASE_URL`| `file:./dev.db`            | SQLite file location (Prisma)  |
| `PORT`        | `4000`                     | HTTP port                      |
| `CORS_ORIGIN` | `http://localhost:5173`    | Comma-separated allowed origins|

### API

Base URL: `http://localhost:4000`

| Method | Path                    | Body                     | Returns          |
| ------ | ----------------------- | ------------------------ | ---------------- |
| GET    | `/api/brews`            | –                        | `200` `Brew[]`   |
| GET    | `/api/brews?method=V60` | –                        | `200` `Brew[]`   |
| GET    | `/api/brews/:id`        | –                        | `200` `Brew` / `404` |
| POST   | `/api/brews`            | `BrewInput`              | `201` `Brew` / `400` |
| PUT    | `/api/brews/:id`        | `BrewInput`              | `200` `Brew` / `400` / `404` |
| DELETE | `/api/brews/:id`        | –                        | `204` / `404`    |

`BrewInput` shape:

```ts
{
  beans: string;         // required, non-empty
  method: string;        // required, non-empty
  coffeeGrams: number;   // > 0
  waterGrams: number;    // > 0
  rating: number;        // 0..5 integer
  tastingNotes: string;  // required, non-empty
}
```

All fields are required. Missing / invalid data → `400 { error, details }`.

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                          # http://localhost:5173
```

### Environment variables (`frontend/.env`)

| Var            | Default                    | Purpose                    |
| -------------- | -------------------------- | -------------------------- |
| `VITE_API_URL` | `http://localhost:4000`    | Backend base URL           |

## Notes on requirements

- Page title reads `Brews: {brewCount}` and updates live.
- Form Save is disabled until every field is filled with a valid value.
- Server re-validates with Zod and returns proper HTTP status codes.
- Layout is responsive down to mobile (single column, modal fills the screen with padding).
- No secrets are hardcoded — see `.env.example` in each folder.