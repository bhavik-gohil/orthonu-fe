FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

# Use BuildKit cache mount to persist Next.js build cache across builds
# This dramatically speeds up rebuilds when only source code changes
RUN --mount=type=cache,target=/app/.next/cache npm run build

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]