# Google Ads MCP Server

Standalone MCP server to manage Google Ads campaigns, ad groups, keywords, and
ads from Claude.

**Tools:** `connection_status`, `list_ad_accounts`, `list_campaigns`,
`create_campaign`, `update_campaign_status`, `create_ad_group`, `add_keywords`,
`create_responsive_search_ad`, `get_report`.

## Setup
```bash
npm install
cp .env.example .env
npm run check
```
You need: a **developer token** (Google Ads → Tools & Settings → API Center,
requires a manager/MCC account), an OAuth client, and a **refresh token**. Set
`GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CLIENT_ID`,
`GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, and
`GOOGLE_ADS_CUSTOMER_ID` (digits only). The server auto-refreshes access tokens.

## Run

**Local (stdio) — Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "google-ads": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/google-ads-mcp/src/index.js"],
      "env": {
        "GOOGLE_ADS_DEVELOPER_TOKEN": "...",
        "GOOGLE_ADS_REFRESH_TOKEN": "...",
        "GOOGLE_ADS_CLIENT_ID": "...",
        "GOOGLE_ADS_CLIENT_SECRET": "...",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "...",
        "GOOGLE_ADS_CUSTOMER_ID": "..."
      }
    }
  }
}
```

**Local (stdio) — Claude Code:**
```bash
claude mcp add google-ads -- node /absolute/path/to/mcp-servers/google-ads-mcp/src/index.js
```

**HTTP (URL connector):**
```bash
npm run start:http     # http://localhost:3002/mcp
```
For a public link (Claude in Chrome / claude.ai connectors), see
[../README.md](../README.md). Set `MCP_AUTH_TOKEN` before exposing publicly.

## Typical launch flow
1. `create_campaign` (created PAUSED; also creates a daily budget)
2. `create_ad_group`
3. `add_keywords`
4. `create_responsive_search_ad` (3–15 headlines, 2–4 descriptions, final URL)
5. `update_campaign_status` → ENABLED when ready; `get_report` to track results

> Budgets/bids are in **micros** (1,000,000 = 1 currency unit).
