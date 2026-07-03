// Small fetch wrapper with consistent error handling, shared shape across
// all three ad MCP servers.

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function request(url, { method = "GET", headers = {}, body, query } = {}) {
  let finalUrl = url;
  if (query && Object.keys(query).length) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    }
    finalUrl += (url.includes("?") ? "&" : "?") + params.toString();
  }

  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    if (typeof body === "string") {
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
      if (!init.headers["Content-Type"]) init.headers["Content-Type"] = "application/json";
    }
  }

  let response;
  try {
    response = await fetch(finalUrl, init);
  } catch (err) {
    throw new ApiError(`Network error calling ${finalUrl}: ${err.message}`, {});
  }

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : undefined;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const detail = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
    throw new ApiError(`HTTP ${response.status} from ${finalUrl}: ${detail}`, {
      status: response.status,
      body: parsed,
    });
  }

  return parsed;
}
