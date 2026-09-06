# ---------- Build stage ----------
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies first so the layer is cached unless package.json changes
COPY package.json package-lock.json ./
RUN npm ci

# API base URL baked into the bundle at build time. Default "/api" is served
# same-origin and reverse-proxied by nginx; override with --build-arg VITE_API_URL=...
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.28-alpine

# Built SPA
COPY --from=build /app/dist /usr/share/nginx/html

# Proxying rules; ${BACKEND_HOST}/${BACKEND_PORT} are substituted by the nginx
# entrypoint (envsubst) from environment variables at container start
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV BACKEND_HOST=vocabularity.backend BACKEND_PORT=8000

EXPOSE 80
