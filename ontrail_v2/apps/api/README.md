# OnTrail API

Early Bun/TypeScript backend for the modern OnTrail app.

## Local Commands

```sh
bun run db:migrate
bun run dev
bun run typecheck
bun run lint
```

Defaults:

- `PORT=3002`
- `DATABASE_URL=postgres://hanko:hanko@localhost:5432/hanko`
- `HANKO_URL=http://localhost:8000`
- `HANKO_JWT_ISSUER` is optional; set it when Hanko issues tokens with an issuer claim

The API currently exposes:

- `GET /api/health`
- `GET /api/sports`
- `GET /api/me`
- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/exercises/:id`
- `PATCH /api/exercises/:id`
- `DELETE /api/exercises/:id`
- `POST /api/exercises/:id/comments`
- `DELETE /api/exercises/:id/comments/:commentId`

Mutating exercise routes derive the owner from the verified Hanko JWT subject. Request bodies do not accept an owner override.

Comments are only readable when `GET /api/exercises/:id` receives a valid Hanko token. Anonymous readers can still see the exercise itself, but the `comments` array is empty.

The current database default points at the local Hanko database because the local infra creates that database today. Move this to a dedicated OnTrail database when the infra is split.
