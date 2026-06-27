// Transport boot helpers shared by all three ad MCP servers.
//
// Supports two ways to run the same server:
//   * stdio  — for local clients (Claude Desktop, Claude Code) via a command.
//   * http   — Streamable HTTP, exposing a URL you can add as a remote
//              connector (e.g. Claude in Chrome / claude.ai connectors).
//
// HTTP mode runs statelessly: a fresh MCP server + transport per request,
// which is the simplest robust setup for a connector endpoint.

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

export function startHttp(buildServer, { port, path = "/mcp", authToken } = {}) {
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
