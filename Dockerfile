FROM node:22-alpine

# Enable corepack
RUN corepack enable

# Install specific pnpm version (optional but recommended)
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

# first copy only package.jsons
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

# copy lockfiles
COPY pnpm-lock.yaml ./

# froze-lockfile flag will ensure consistent dependency installation, if lock file changes will throw error
RUN pnpm install --frozen-lockfile 

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build --filter=api

# remove dev dependencies
RUN pnpm prune --prod

WORKDIR /app/apps/api
CMD [ "pnpm", "start" ]
