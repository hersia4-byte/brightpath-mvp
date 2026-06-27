# Ad Platform MCP Servers

Three **separate, standalone** MCP servers — one per ad platform — that let
Claude manage your ad campaigns end to end (campaign → ad group → creative/ad →
reporting):

| Folder | Server | Default HTTP port |
|--------|--------|-------------------|
| [`tiktok-ads-mcp/`](./tiktok-ads-mcp) | TikTok Ads | 3001 |
| [`google-ads-mcp/`](./google-ads-mcp) | Google Ads | 3002 |
| [`pinterest-ads-mcp/`](./pinterest-ads-mcp) | Pinterest Ads | 3003 |

Each one is independent: its own credentials, its own dependencies, its own
URL. Run only the ones you need.

> ⚠️ **These tools spend real money.** New ad groups and ads are created
> **PAUSED** wherever the platform allows, so nothing serves until you turn it
> on. Always review before enabling.

---

## What each server can do

**TikTok** — list accounts/identities, list & create campaigns, create ad
groups, upload image/video creatives, create ads, pause/resume, reporting.

**Google Ads** — list accounts, list & create campaigns, create ad groups, add
keywords, create responsive search ads, pause/resume, reporting.

**Pinterest** — list accounts, list & create campaigns, create ad groups, list
& create pins (creatives), create ads, pause/resume, reporting.

---

## Two ways to connect to Claude

### Option A — Local (Claude Desktop / Claude Code) via a command
Best if you run Claude on your computer. Uses the **stdio** transport — no URL,
no hosting. See each server's own README for the exact config block.

### Option B — A URL you paste into Claude (Claude in Chrome / claude.ai connectors)
Claude's web/Chrome connectors connect to a **remote MCP server URL**. Each
server can run in HTTP mode and expose an endpoint at `…/mcp`:

```bash
cd tiktok-ads-mcp && npm install && npm run start:http
# -> http://localhost:3001/mcp
```

The catch: **a connector URL must be reachable by Claude over public HTTPS** —
`localhost` only works for tools running on the same machine. So you have two
sub-options to turn the local server into a real link:

#### B1. Quick public link with a tunnel (fastest, good for testing)
Run the server, then point a tunnel at its port:

```bash
# in one terminal
cd tiktok-ads-mcp && npm run start:http        # listens on :3001

# in another terminal (pick one tool)
cloudflared tunnel --url http://localhost:3001
#   or
ngrok http 3001
```

The tunnel prints an `https://…` URL. Your connector link is that URL **+ `/mcp`**, e.g.
`https://random-name.trycloudflare.com/mcp`.

#### B2. Deploy for a permanent link
This repo ships deploy config so each server becomes an always-on service with a
stable URL.

**Render (easiest — one blueprint deploys all three):**
1. In [Render](https://render.com): **New → Blueprint**, pick this repo/branch.
   Render reads [`render.yaml`](./render.yaml) and creates three web services:
   `tiktok-ads-mcp`, `google-ads-mcp`, `pinterest-ads-mcp`.
2. For each service, open it in the dashboard and fill in its credential env
   vars (they're declared but left blank for you to set securely).
3. Each service's connector link is `https://<service-name>.onrender.com/mcp`
   (e.g. `https://tiktok-ads-mcp.onrender.com/mcp`).

**Any other host (Railway, Fly.io, a VPS):** each server folder has a
`Dockerfile`. Point the host at the folder, set the platform env vars, and
deploy. The host provides `PORT` automatically. Your link is
`https://your-app.example.com/mcp`.

#### Add the link in Claude
In Claude (web/Chrome): **Settings → Connectors → Add custom connector**, paste
the `…/mcp` URL, and connect. Repeat for each platform's URL.

#### Won't connect? ("Couldn't connect to the server")
1. **Open `https://<service>.onrender.com/health` in a browser.** It should show
   `{"status":"ok"}`. On Render's free plan the service sleeps when idle and
   takes ~50s to wake — wait for it to respond, *then* click Connect in Claude.
2. If `/health` doesn't load at all, the service isn't deployed or its build
   failed — check the deploy logs in the Render dashboard.
3. If `/health` works but Claude still fails, make sure **`MCP_AUTH_TOKEN` is
   blank** (Dashboard → service → Environment). The basic connector flow can't
   send an auth header, so a token set here will reject Claude. Remove it and
   let the service redeploy.

> 🔒 **Security trade-off.** A blank `MCP_AUTH_TOKEN` means the URL is
> unauthenticated — anyone who has it can spend your ad budget. Keep the URL
> private. Only set a token if you use a client that can send
> `Authorization: Bearer <token>`.

---

## Quick start (per server)

```bash
cd <platform>-ads-mcp
npm install
cp .env.example .env     # fill in your platform credentials
npm run check            # confirm credentials are detected
npm run start:http       # HTTP mode (URL)   — or `npm start` for stdio
```

## Where to get credentials

- **TikTok:** create an app at <https://business-api.tiktok.com/> and complete
  the TikTok for Business OAuth flow to get an access token.
- **Google Ads:** developer token from Google Ads → Tools & Settings → API
  Center (needs a manager/MCC account) + an OAuth client & refresh token.
- **Pinterest:** create an app at <https://developers.pinterest.com/> with
  `ads:read`, `ads:write`, `pins:read`, `pins:write` scopes and complete OAuth.

Full per-platform details are in each server's own `README` / `.env.example`.

## A note on "fully launching" an ad

These servers cover the real campaign-building chain, but each platform has
extra requirements (detailed targeting, billing/identity setup, creative specs,
review/approval) before an ad serves. The tools accept pass-through `extra`
fields so Claude can supply anything platform-specific that isn't a named
parameter.
