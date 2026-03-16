# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/frontend

# Build stage for API
FROM node:20-alpine AS api-builder
WORKDIR /app
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/api

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install serve for frontend and node for API
RUN npm install -g serve

# Copy built frontend
COPY --from=frontend-builder /app/packages/frontend/dist ./frontend/dist

# Copy API
COPY --from=api-builder /app/packages/api/dist ./api/dist
COPY --from=api-builder /app/packages/api/node_modules ./api/node_modules
COPY --from=api-builder /app/packages/api/package.json ./api/

# Copy shared package
COPY --from=api-builder /app/packages/shared/dist ./shared/dist
COPY --from=api-builder /app/packages/shared/package.json ./shared/

WORKDIR /app/api

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000 3000

CMD ["node", "dist/server.js"]