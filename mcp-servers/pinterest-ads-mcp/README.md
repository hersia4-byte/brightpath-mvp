# Pinterest Ads MCP Server

Standalone MCP server to manage Pinterest ad campaigns, ad groups, pins, and ads
from Claude.

**Tools:** `connection_status`, `list_ad_accounts`, `list_campaigns`,
`create_campaign`, `update_campaign_status`, `create_ad_group`, `list_pins`,
`create_pin`, `create_ad`, `get_report`.

## Setup
```bash
npm install
cp .env.example .env   # set PINTEREST_ACCESS_TOKEN (+ optional PINTEREST_AD_ACCOUNT_ID)
npm run check
```
Create an app at <https://developers.pinterest.com/> with `ads:read`,
`ads:write`, `pins:read`, `pins:write` scopes and complete OAuth.

## Run

**Local (stdio) — Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "pinterest-ads": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/pinterest-ads-mcp/src/index.js"],
      "env": { "PINTEREST_ACCESS_TOKEN": "...", "PINTEREST_AD_ACCOUNT_ID": "..." }
    }
  }
}
```

**Local (stdio) — Claude Code:**
```bash
claude mcp add pinterest-ads -- node /absolute/path/to/mcp-servers/pinterest-ads-mcp/src/index.js
```

**HTTP (URL connector):**
```bash
npm run start:http     # http://localhost:3003/mcp
```
For a public link (Claude in Chrome / claude.ai connectors), see
[../README.md](../README.md). Set `MCP_AUTH_TOKEN` before exposing publicly.

## Typical launch flow
1. `create_campaign` (created PAUSED)
2. `create_ad_group`
3. `create_pin` (or `list_pins` to reuse an existing pin) → get a pin id
4. `create_ad` promoting that pin in the ad group
5. `update_campaign_status` → ACTIVE when ready; `get_report` to track results

> Budgets are in **micro currency** (1,000,000 = 1 unit).
