# Ads MCP Server

An [MCP](https://modelcontextprotocol.io) server that lets Claude manage your
**TikTok**, **Google**, and **Pinterest** ad campaigns — list accounts, list
campaigns, create campaigns, pause/resume them, and pull performance reports —
directly from a conversation.

It speaks MCP over **stdio**, so it works with Claude Desktop, Claude Code, and
any other MCP client.

> ⚠️ **Safety:** This server can spend real money on real ad platforms.
> New campaigns are created **PAUSED** wherever the platform allows it, so
> nothing serves until you explicitly enable it. Review every change.

---

## What Claude can do once connected

| Tool | What it does |
|------|--------------|
| `ads_list_connections` | Show which platforms are configured |
| `tiktok_* / google_* / pinterest_*` | `list_ad_accounts`, `list_campaigns`, `create_campaign`, `update_campaign_status`, `get_report` for each platform |

Ask Claude things like:
- *"Which ad platforms am I connected to?"*
- *"List my Google Ads campaigns and their spend last week."*
- *"Create a paused TikTok TRAFFIC campaign called Summer Sale with a $20/day budget."*
- *"Pause Pinterest campaign 12345."*

---

## 1. Install

```bash
cd mcp-ads-server
npm install
```

## 2. Get your credentials

You configure **only the platforms you want**. A platform with missing
credentials is simply reported as "not connected".

### TikTok
1. Create an app in the [TikTok for Business developer portal](https://business-api.tiktok.com/).
2. Complete the OAuth flow for your advertiser account to obtain an **access token**.
3. Set `TIKTOK_ACCESS_TOKEN`. Optionally set `TIKTOK_ADVERTISER_ID` as a default
   (or call `tiktok_list_ad_accounts` to find it).

### Google Ads
1. Apply for a **developer token** in Google Ads → *Tools & Settings → API Center*
   (you need a manager/MCC account).
2. Create an OAuth client (Web or Desktop) in Google Cloud Console and obtain a
   **refresh token** for an account with Google Ads access.
3. Set `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_REFRESH_TOKEN`,
   `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`,
   `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, and `GOOGLE_ADS_CUSTOMER_ID` (digits only).
   *(Alternatively paste a short-lived `GOOGLE_ADS_ACCESS_TOKEN` for quick tests.)*

### Pinterest
1. Create an app in the [Pinterest developer portal](https://developers.pinterest.com/)
   with the `ads:read` and `ads:write` scopes.
2. Complete OAuth to obtain an **access token**.
3. Set `PINTEREST_ACCESS_TOKEN`. Optionally set `PINTEREST_AD_ACCOUNT_ID`.

Copy `.env.example` to `.env` and fill in what you have:

```bash
cp .env.example .env
```

## 3. Verify configuration

```bash
npm run check
```

This prints which platforms are configured without starting the server.

## 4. Connect it to Claude

The server reads credentials from environment variables. Claude clients let you
pass these in the MCP config.

### Claude Desktop
Edit `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "ads": {
      "command": "node",
      "args": ["/absolute/path/to/brightpath-mvp/mcp-ads-server/src/index.js"],
      "env": {
        "TIKTOK_ACCESS_TOKEN": "...",
        "TIKTOK_ADVERTISER_ID": "...",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "...",
        "GOOGLE_ADS_REFRESH_TOKEN": "...",
        "GOOGLE_ADS_CLIENT_ID": "...",
        "GOOGLE_ADS_CLIENT_SECRET": "...",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "...",
        "GOOGLE_ADS_CUSTOMER_ID": "...",
        "PINTEREST_ACCESS_TOKEN": "...",
        "PINTEREST_AD_ACCOUNT_ID": "..."
      }
    }
  }
}
```

Restart Claude Desktop. The ad tools will appear in the tools menu.

### Claude Code
```bash
claude mcp add ads -- node /absolute/path/to/brightpath-mvp/mcp-ads-server/src/index.js
```
Then add the env vars to the generated config, or export them in your shell
before launching.

---

## Notes & limitations

- **Campaigns are containers.** Fully launching an ad also requires ad groups,
  creatives/ads, and targeting — each platform's API has many more endpoints.
  This server covers the campaign lifecycle + reporting as a solid foundation;
  extend `src/platforms/*.js` to add ad groups and creatives.
- **Budgets:** Google and Pinterest use *micros* (1,000,000 = 1 currency unit);
  TikTok uses the plain account-currency amount.
- **Tokens expire.** For Google, prefer the refresh-token flow so the server
  mints access tokens automatically. TikTok/Pinterest tokens must be refreshed
  per each platform's policy.
- **Never commit `.env`** — it contains live credentials.

## Project layout

```
mcp-ads-server/
├── src/
│   ├── index.js            # MCP server + tool definitions
│   ├── config.js           # env-based configuration
│   ├── http.js             # fetch wrapper with error handling
│   └── platforms/
│       ├── tiktok.js
│       ├── google.js
│       └── pinterest.js
├── .env.example
└── package.json
```
