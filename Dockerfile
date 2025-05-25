FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

FROM base AS deps
# Because of docker layer caching dependencies should only be re-installed if package.json or pnpm-lock.yaml change.

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# non root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install only prod dependencies
RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
