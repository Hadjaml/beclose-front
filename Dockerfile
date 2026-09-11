# syntax=docker/dockerfile:1

# Bewise frontend — production image.
#
# Multi-stage build relying on Next.js Output File Tracing
# (`output: "standalone"` in next.config.ts): only the files actually
# imported by the app are copied into the final image, node_modules is
# never installed in the runner stage. See
# node_modules/next/dist/docs/01-app/02-guides/self-hosting.md and
# node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md
# (read locally before touching this file — this Next.js version has
# breaking changes from upstream, see AGENTS.md).

ARG NODE_VERSION=24-alpine

# ---- deps: install dependencies from the lockfile only ---------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: compile the Next.js app ---------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No secret or backend URL is required to build (see README, "Variables
# d'environnement") — a NEXT_PUBLIC_* build arg can be threaded through here
# once the backend contract exists, never a private value.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal production image ----------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Traced server + dependencies.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets are not part of the standalone trace by design (meant to be
# served by a CDN); copied in manually per the self-hosting guide.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
