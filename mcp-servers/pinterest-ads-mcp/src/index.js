#!/usr/bin/env node
// Entry point for the Pinterest Ads MCP server.
//
//   node src/index.js            # stdio (local clients)
//   node src/index.js --http     # Streamable HTTP (remote connector URL)
//   node src/index.js --check    # print config status and exit
//
// HTTP options via env: PORT (default 3003), MCP_PATH (default /mcp),
// MCP_AUTH_TOKEN (optional bearer token to protect the endpoint).

import { ready, missingHint } from "./config.js";
import { buildServer } from "./server.js";
import { startStdio, startHttp } from "./transport.js";
import { routes } from "./oauth.js";

if (process.argv.includes("--check")) {
  console.log(JSON.stringify({ pinterest: ready ? "configured" : `NOT configured — ${missingHint}` }, null, 2));
  process.exit(0);
}

const useHttp = process.argv.includes("--http") || process.env.MCP_TRANSPORT === "http";

if (useHttp) {
  startHttp(buildServer, {
    port: Number(process.env.PORT) || 3003,
    path: process.env.MCP_PATH || "/mcp",
    authToken: process.env.MCP_AUTH_TOKEN,
    routes,
  });
} else {
  startStdio(buildServer).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
