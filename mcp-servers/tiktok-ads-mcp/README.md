# TikTok Ads MCP Server

Standalone MCP server to manage TikTok ad campaigns and creatives from Claude.

**Tools:** `connection_status`, `list_ad_accounts`, `list_identities`,
`list_regions`, `list_languages`, `list_interest_categories`, `list_campaigns`,
`create_campaign`, `update_campaign_status`, `create_adgroup` (with full
targeting: geo, age, gender, languages, interests, OS), `upload_image`,
`upload_video`, `create_ad`, `get_report`.

📋 **See [EXAMPLE.md](./EXAMPLE.md) for a full walkthrough** — campaign → ad
group with targeting → creative upload → live ad → reporting.

## Setup
```bash
npm install
cp .env.example .env   # set TIKTOK_ACCESS_TOKEN (+ optional TIKTOK_ADVERTISER_ID)
npm run check
```
Get a token by creating an app at <https://business-api.tiktok.com/> and
completing the TikTok for Business OAuth flow.

## Run

**Local (stdio) — Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "tiktok-ads": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/tiktok-ads-mcp/src/index.js"],
      "env": { "TIKTOK_ACCESS_TOKEN": "...", "TIKTOK_ADVERTISER_ID": "..." }
    }
  }
}
```

**Local (stdio) — Claude Code:**
```bash
claude mcp add tiktok-ads -- node /absolute/path/to/mcp-servers/tiktok-ads-mcp/src/index.js
```

**HTTP (URL connector):**
```bash
npm run start:http     # http://localhost:3001/mcp
```
To get a public link for Claude in Chrome / claude.ai connectors, see
[../README.md](../README.md) (tunnel or deploy). Set `MCP_AUTH_TOKEN` before
exposing it publicly.

## Typical launch flow
1. `list_ad_accounts` / `list_identities`
2. `create_campaign`
3. `create_adgroup` (targeting, budget, bidding — use `extra` for objective-specific fields)
4. `upload_image` / `upload_video` → get media IDs
5. `create_ad` with creatives referencing those media IDs + an identity
6. `update_campaign_status` to ENABLE when ready; `get_report` to track results

> New work is created paused/safe where possible — review before enabling.
