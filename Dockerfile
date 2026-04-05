FROM node:22-alpine AS builder

# Enable corepack
RUN corepack enable

# Install specific pnpm version (optional but recommended)
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

# first copy only package.jsons
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# copy lockfiles
COPY pnpm-lock.yaml ./

# froze-lockfile flag will ensure consistent dependency installation, if lock file changes will throw error
RUN pnpm install --frozen-lockfile 

COPY . .
RUN pnpm build --filter=api

# stage: 2
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder /app/packages/validation/package.json ./packages/validation/package.json
COPY --from=builder /app/packages/validation/dist ./packages/validation/dist
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json
COPY --from=builder /app/packages/types/dist ./packages/types/dist

WORKDIR /app/apps/api
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
