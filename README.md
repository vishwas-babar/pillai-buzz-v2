# Pillaibuzz

Pillaibuzz is a Turborepo monorepo with multiple apps and shared packages.

## Workspace

- `apps/api`: NestJS backend API
- `apps/web`: web app
- `apps/mobile`: mobile app
- `packages/db`: database schema and migrations
- `packages/validation`: shared validation schemas
- `packages/types`: shared TypeScript types
- `packages/config`: shared config/tsconfig setup

## Prerequisites

- Node.js `>=18`
- `pnpm` (workspace package manager)
- Docker (for local PostgreSQL)

## Install dependencies

```bash
pnpm install
```

## Run local PostgreSQL

```bash
docker run -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pillaibuzz -d -p 6000:5432 postgres
```

Default local connection string:

```bash
postgres://postgres:postgres@localhost:6000/pillaibuzz
```

## Run in development

```bash
pnpm dev
```

## Common scripts

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```
