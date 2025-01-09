FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN npx turbo prune meter --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build

FROM base AS installer
COPY --from=pruner /app/out/json/ .
RUN pnpm install --prod

FROM base AS runner
COPY --from=builder /app/apps/meter ./apps/meter
COPY --from=installer /app/node_modules ./node_modules
WORKDIR /app/apps/meter

CMD ["node", "src/index.js"]
