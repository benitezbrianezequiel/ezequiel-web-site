# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:22-slim AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build the Astro site ─────────────────────────────
FROM node:22-slim AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: Production runtime ───────────────────────────────
FROM node:22-slim AS runtime

# better-sqlite3 needs these native libs at runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libstdc++6 curl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

WORKDIR /app

# Copy built output and server entry
COPY --from=build /app/dist ./dist

# Copy better-sqlite3 native binding from deps
COPY --from=deps /app/node_modules ./node_modules

# Seed script + data dir
COPY scripts ./scripts
COPY data/.gitkeep ./data/.gitkeep

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
 CMD curl -f http://localhost:4321 || exit 1