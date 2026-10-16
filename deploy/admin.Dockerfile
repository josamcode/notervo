# Static build of apps/admin-dashboard served by nginx.
# Build from the repository root:
#   docker build -f deploy/admin.Dockerfile --build-arg VITE_API_URL=https://api.example.com/api .
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/admin-dashboard/package.json apps/admin-dashboard/package.json
RUN npm ci --workspace=@notervo/admin
COPY apps/admin-dashboard apps/admin-dashboard
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "VITE_API_URL build argument is required" && exit 1)
RUN npm run build --workspace=@notervo/admin

FROM nginx:1.29-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/admin-dashboard/dist /usr/share/nginx/html
EXPOSE 80
