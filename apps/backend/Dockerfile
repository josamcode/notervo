# Build from repository root: docker build -f apps/backend/Dockerfile -t notervo-api .
FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/admin-dashboard/package.json apps/admin-dashboard/package.json
RUN npm ci --omit=dev --workspace=@notervo/api && npm cache clean --force
COPY --chown=node:node apps/backend apps/backend
USER node
WORKDIR /app/apps/backend
EXPOSE 5050
CMD ["node", "index.js"]
