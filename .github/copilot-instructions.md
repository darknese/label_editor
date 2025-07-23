# Copilot Instructions for label_editor

## Project Overview
- **Monorepo:** Contains `client/` (React) and `server/` (NestJS) apps.
- **Purpose:** Label editor with template management, user authentication, and file storage via Minio (S3-compatible).

## Architecture
- **client/**: React app (Create React App), Zustand for state, Konva for canvas editing. Key files: `src/components/LabelEditor.tsx`, `src/store/useEditorStore.ts`.
- **server/**: NestJS app, Prisma for PostgreSQL, JWT auth, Minio integration. Key modules: `auth`, `users`, `minio`, `templates`.
- **infrastructure/**: Contains docker configs and data folders for local services. Do not commit `data/` folders to git.

## Developer Workflows
- **Frontend:**
  - Dev: `cd client && npm start` (http://localhost:3000)
  - Build: `cd client && npm run build`
  - Test: `cd client && npm test`
- **Backend:**
  - Dev: `cd server && npm run start:dev` (http://localhost:8000)
  - Prisma migration: `npx prisma migrate dev --name <desc>`
  - Test: `cd server && npm run test`
- **Docker Compose:**
  - `docker-compose up` (starts postgres, minio, etc.)

## Patterns & Conventions
- **Templates:** Only store metadata and links to images (not image data) in templates. Images are uploaded to Minio and referenced by URL.
- **Auth:** JWT tokens, secret from `.env` (`SECRET_KEY`). Always use DI for `ConfigService`.
- **Prisma:** Models in `server/prisma/schema.prisma`. Do not commit generated migration SQLs unless needed for team review.
- **Infrastructure:** Ignore `infrastructure/postgres/data/` and `infrastructure/s3/data/` in `.gitignore`.
- **Error Handling:** Auth errors return 401 with message `Unauthorized`.

## Integration Points
- **Minio:** Used for file storage. Access via `MinioService` in backend. Credentials/config in `.env`.
- **Prisma:** All DB access via `PrismaService`. User, template, and file metadata stored in PostgreSQL.
- **JWT:** Auth via `passport-jwt` strategy. Token must be sent as `Authorization: Bearer <token>`.

## Examples
- **Template upload:**
  - POST `/templates/upload` with JWT and multipart file. Only links to images stored in template JSON.
- **User login:**
  - POST `/auth/login` returns JWT token. Use this for all protected endpoints.

## Key Files
- `client/src/components/LabelEditor.tsx` — main editor UI
- `server/src/minio/minio.service.ts` — Minio integration
- `server/src/auth/strategies/jwt.strategy.ts` — JWT validation
- `server/prisma/schema.prisma` — DB schema
- `.env` — secrets and service config
- `.gitignore` — ignore infrastructure data folders

---
If any workflow or integration is unclear, ask for clarification or examples from the user.
