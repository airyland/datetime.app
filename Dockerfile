FROM node:22.23.4-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

# Build on the runner's native platform: emulated (qemu) arm64 builds crash during
# static generation. The .next output is architecture independent.
FROM --platform=$BUILDPLATFORM node:22.23.4-alpine AS build-base

RUN npm install -g pnpm

WORKDIR /app

FROM build-base AS deps
# Because of docker layer caching dependencies should only be re-installed if package.json or pnpm-lock.yaml change.

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM build-base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_GOOGLE_ADSENSE_ID
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN=datetime.app
ARG NEXT_PUBLIC_ANALYTICS_SCRIPT=https://click.pageview.click/js/script.js
ENV NEXT_PUBLIC_GOOGLE_ADSENSE_ID=$NEXT_PUBLIC_GOOGLE_ADSENSE_ID
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN=$NEXT_PUBLIC_ANALYTICS_DOMAIN
ENV NEXT_PUBLIC_ANALYTICS_SCRIPT=$NEXT_PUBLIC_ANALYTICS_SCRIPT
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000

# non root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only prod dependencies
RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
