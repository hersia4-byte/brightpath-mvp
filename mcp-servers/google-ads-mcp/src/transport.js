// Transport boot helpers shared by all three ad MCP servers.
//
// Supports two ways to run the same server:
//   * stdio  — for local clients (Claude Desktop, Claude Code) via a command.
//   * http   — Streamable HTTP, exposing a URL you can add as a remote
//              connector (e.g. Claude in Chrome / claude.ai connectors).
//
// HTTP mode also serves optional browser routes (e.g. an OAuth "Connect"
// helper) passed in via `routes`.

import http from "node:http";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export async function startStdio(buildServer) {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdout carries the JSON-RPC stream.
  console.error("MCP server running on stdio");
}

// routes: optional array of { path, handler(req, res, url) }. Handlers are
// plain browser endpoints (not MCP) — used for the OAuth Connect helper.
export function startHttp(buildServer, { port, path = "/mcp", authToken, routes = [] } = {}) {
  const httpServer = http.createServer(async (req, res) => {
    // Permissive CORS so browser-based clients can reach the endpoint.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" }).end('{"status":"ok"}');
      return;
    }

    // Browser helper routes (e.g. /auth, /auth/callback) run before the MCP
    // endpoint and are not subject to the MCP bearer-token gate.
    const route = routes.find((r) => r.path === url.pathname);
    if (route) {
      try {
        await route.handler(req, res, url);
      } catch (err) {
        console.error("Route error:", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "text/html" }).end(`<h1>Error</h1><pre>${escapeHtml(err.message)}</pre>`);
        }
      }
      return;
    }

    if (url.pathname !== path) {
      res.writeHead(404, { "Content-Type": "application/json" }).end('{"error":"not found"}');
      return;
    }

    // Optional bearer-token gate. Strongly recommended when the endpoint is
    // public, since these tools control real ad spend.
    if (authToken) {
      const auth = req.headers["authorization"] || "";
      if (auth !== `Bearer ${authToken}`) {
        res
          .writeHead(401, { "Content-Type": "application/json" })
          .end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32001, message: "Unauthorized" }, id: null }));
        return;
      }
    }

    try {
      const server = buildServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);

      let parsed;
      if (req.method === "POST") {
        const raw = await readBody(req);
        parsed = raw ? JSON.parse(raw) : undefined;
      }
      await transport.handleRequest(req, res, parsed);
    } catch (err) {
      console.error("Request error:", err);
      if (!res.headersSent) {
        res
          .writeHead(500, { "Content-Type": "application/json" })
          .end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null }));
      }
    }
  });

  httpServer.listen(port, () => {
    console.error(`MCP server (HTTP) listening on http://localhost:${port}${path}`);
    if (!authToken) {
      console.error("WARNING: no MCP_AUTH_TOKEN set — endpoint is unauthenticated. Set one before exposing publicly.");
    }
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 5_000_000) reject(new Error("Request body too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// The server's own public base URL (used to build the OAuth redirect URI).
// Render sets RENDER_EXTERNAL_URL; otherwise derive from the request host.
export function publicBaseUrl(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
}

// Shared HTML page that displays the resulting token(s) for copy-paste.
export function renderTokenPage({ title, intro, fields, nextSteps }) {
  const rows = fields
    .map(
      (f) => `
      <div class="field">
        <div class="label">${escapeHtml(f.key)}</div>
        <textarea readonly onclick="this.select()">${escapeHtml(f.value ?? "")}</textarea>
      </div>`
    )
    .join("");
  const steps = (nextSteps || []).map((s) => `<li>${s}</li>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#111;line-height:1.5}
  h1{font-size:22px} .ok{color:#0a7d28}
  .field{margin:16px 0} .label{font-weight:600;font-size:13px;color:#444;margin-bottom:4px}
  textarea{width:100%;height:60px;font-family:ui-monospace,monospace;font-size:13px;padding:8px;border:1px solid #ccc;border-radius:8px;background:#fafafa}
  ol{background:#f5f7ff;padding:16px 16px 16px 36px;border-radius:8px}
  .copy{font-size:12px;color:#666}
</style></head><body>
<h1 class="ok">✓ ${escapeHtml(title)}</h1>
<p>${intro}</p>
<p class="copy">Tip: click a box to select all, then copy.</p>
${rows}
<h3>Next steps</h3>
<ol>${steps}</ol>
</body></html>`;
}
