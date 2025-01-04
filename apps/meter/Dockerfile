FROM node:23-alpine AS base

RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN npx turbo prune meter --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install --prod
COPY --from=builder /app/out/full/ .
RUN npx turbo build

FROM base AS runner
WORKDIR /app
COPY --from=installer /app .

CMD ["pnpm", "start"]
