FROM node:22.23.4-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_GOOGLE_ADSENSE_ID
ARG NEXT_PUBLIC_ANALYTICS_DOMAIN=datetime.app
ARG NEXT_PUBLIC_ANALYTICS_SCRIPT=https://click.pageview.click/js/script.js
ENV NEXT_PUBLIC_GOOGLE_ADSENSE_ID=$NEXT_PUBLIC_GOOGLE_ADSENSE_ID
ENV NEXT_PUBLIC_ANALYTICS_DOMAIN=$NEXT_PUBLIC_ANALYTICS_DOMAIN
ENV NEXT_PUBLIC_ANALYTICS_SCRIPT=$NEXT_PUBLIC_ANALYTICS_SCRIPT
RUN pnpm build

FROM node:22.23.4-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
