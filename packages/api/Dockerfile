# Build stage for API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
COPY tsconfig.json ./

# Build shared package first
RUN npm run build --workspace=packages/shared

# Build API
RUN npm run build --workspace=packages/api

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/node_modules ./node_modules
COPY --from=builder /app/packages/api/package.json ./
COPY --from=builder /app/packages/shared/dist ../shared/dist
COPY --from=builder /app/packages/shared/package.json ../shared/

# Copy prisma schema for migrations
COPY --from=builder /app/packages/api/prisma ./prisma

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/server.js"]