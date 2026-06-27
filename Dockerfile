# # syntax=docker/dockerfile:1
# # Multi-stage build for a small, production Next.js (standalone) image.

# # ---- 1) Install dependencies ----
# FROM node:20-slim AS deps
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install

# # ---- 2) Build the app ----
# FROM node:20-slim AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED=1

# # Build-time arguments — passed from GitHub Actions secrets via --build-arg.
# # Default values are safe placeholders so the image still builds in environments
# # where secrets are not set (e.g. feature-branch CI without access to secrets).
# ARG RESEND_API_KEY=re_build_placeholder
# ARG OPENAI_API_KEY=sk_build_placeholder
# ARG MONGODB_URI=mongodb+srv://placeholder:placeholder@placeholder.example.mongodb.net/
# ARG NEXTAUTH_SECRET=build_placeholder
# ARG SECRET_KEY=build_placeholder
# ARG NEXT_PUBLIC_DOMAIN=http://localhost:3000

# # Expose the args as env vars so `next build` can see them.
# ENV RESEND_API_KEY=$RESEND_API_KEY \
#     OPENAI_API_KEY=$OPENAI_API_KEY \
#     MONGODB_URI=$MONGODB_URI \
#     NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
#     SECRET_KEY=$SECRET_KEY \
#     NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
# RUN npm run build

# # ---- 3) Minimal runtime image ----
# FROM node:20-slim AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# # Run as a non-root user (security best practice)
# RUN addgroup --system --gid 1001 nodejs \
#  && adduser  --system --uid 1001 nextjs

# # Copy only what the standalone server needs
# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs
# EXPOSE 3000
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# CMD ["node", "server.js"]


# syntax=docker/dockerfile:1
# Multi-stage build for a small, production Next.js (standalone) image.

# ---- 1) Install dependencies ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# ---- 2) Build the app ----
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Public value only — NEXT_PUBLIC_* is inlined into the client bundle, so it is not a secret.
ARG NEXT_PUBLIC_DOMAIN=http://localhost:3000
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN

# MONGODB_URI is the ONLY secret needed at build time (SSG reads the DB during `next build`).
# Mounted via BuildKit: available only during this RUN, never written to any image layer.
# required=false + fallback keeps feature-branch CI (no secret access) building.
#
# NOTE: runtime-only secrets (RESEND_API_KEY, OPENAI_API_KEY, NEXTAUTH_SECRET, SECRET_KEY)
# are intentionally NOT in the build. Set them as Azure App Service application settings.
RUN --mount=type=secret,id=mongodb_uri,required=false \
    MONGODB_URI="$(cat /run/secrets/mongodb_uri 2>/dev/null || echo 'mongodb+srv://placeholder:placeholder@placeholder.example.mongodb.net/')" \
    npm run build

# ---- 3) Minimal runtime image ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what the standalone server needs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]