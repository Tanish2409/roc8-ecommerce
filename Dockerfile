FROM node:20-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Setup Infisical [https://infisical.com/docs/integrations/platforms/docker] for env management as a vault
RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

# ==============================================================
# 1. Install dependencies only when needed
# ==============================================================
FROM base AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY ./prisma ./
RUN npm install


# ==============================================================
# 2. Rebuild the source code only when needed
# ==============================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG infisical_env
ARG infisical_project_id

# load env from infisical vault for build process
RUN --mount=type=secret,id=infisical_token,required=true \
  INFISICAL_TOKEN=$(cat /run/secrets/infisical_token) \
  infisical run --env=$infisical_env --projectId=$infisical_project_id --path=/roc8-ecommerce -- npm run build


# ==============================================================
# 3. Production image, copy all the files and run next
# ==============================================================
FROM base AS runner
WORKDIR /app


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# COPY --from=builder /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# CMD ["infisical", "run", "--env=staging", "--path=/roc8-ecommerce", "--", "node", "server.js"]
