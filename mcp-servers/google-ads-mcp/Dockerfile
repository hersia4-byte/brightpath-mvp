# Portable container for the Google Ads MCP server (HTTP mode).
# Works on Railway, Fly.io, a VPS, or any Docker host.
# The host should provide PORT; credentials are passed as env vars at runtime.
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV MCP_TRANSPORT=http
EXPOSE 3002
CMD ["node", "src/index.js", "--http"]
