# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Nur package-Dateien zuerst -> Cache
COPY client/package*.json ./
RUN npm ci --legacy-peer-deps

# Quellcode
COPY client/ ./

# Build-Arg -> wird zu REACT_APP_API_URL
ARG API_PUBLIC_URL
ENV REACT_APP_API_URL=$API_PUBLIC_URL

# Production-Build
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM nginx:1.25-alpine AS runtime

# Eigene Nginx-Konfig
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Build-Output deployen
COPY --from=builder /app/build /usr/share/nginx/html

# Health-Datei
RUN printf 'ok' > /usr/share/nginx/html/health

EXPOSE 80

# Healthcheck via IPv4
HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

