FROM node:18-alpine

WORKDIR /app

# Nur package-Dateien zuerst (Cache)
COPY server/package*.json ./

# Prod-Install, keine DevDeps
RUN npm ci --omit=dev

# App-Code
COPY server/ ./

# Env Defaults (können durch Compose/.env überschrieben werden)
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Healthcheck nutzt IPv4 loopback
HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["npm", "start"]

