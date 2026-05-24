FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json index.ts index.js drizzle.config.js ./
COPY src ./src
COPY drizzle ./drizzle

RUN pnpm run build

FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.js ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.js ./

ENV NODE_ENV=production
EXPOSE 8000

CMD ["sh", "-c", "pnpm run db:migrate && node index.js"]
