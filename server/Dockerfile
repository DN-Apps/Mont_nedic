FROM node:18-alpine
WORKDIR /app

# Healthcheck-Tool bereitstellen
RUN apk add --no-cache curl

# Nur package-Dateien zuerst (Cache)
COPY server/package*.json ./
RUN npm ci --omit=dev

# App-Code
COPY server/ ./

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Healthcheck mit Start-Periode, damit MySQL Zeit hat
HEALTHCHECK --interval=10s --timeout=5s --retries=6 --start-period=25s \
  CMD curl -fsS http://127.0.0.1:5000/api/health >/dev/null || exit 1

CMD ["npm", "start"]
