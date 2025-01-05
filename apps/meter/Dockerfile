FROM node:23-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --filter meter
RUN npx turbo build --filter meter

FROM base AS installer
COPY . .
RUN pnpm install --filter meter --prod

FROM base AS runner
COPY --from=builder /app/apps/meter/src ./apps/meter/src
COPY --from=builder /app/apps/meter/.env ./apps/meter/.env
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/meter/node_modules ./apps/meter/node_modules
WORKDIR /app/apps/meter

CMD ["node", "src/index.js"]
