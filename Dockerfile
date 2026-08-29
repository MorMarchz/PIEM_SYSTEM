# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN node node_modules/vite/bin/vite.js build

# Stage 2: Production Server Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Copy Static Frontend Dist from Stage 1 into Express Public Directory
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5001

CMD ["node", "src/server.js"]
