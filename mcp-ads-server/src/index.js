#!/usr/bin/env node
// MCP server exposing TikTok, Google, and Pinterest ad-management tools.
//
// Transport: stdio (works with Claude Desktop, Claude Code, and any MCP client).
// Run `node src/index.js --check` to print which platforms are configured
// without starting the server.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { status, missingHints } from "./config.js";
import { tiktok } from "./platforms/tiktok.js";
import { google } from "./platforms/google.js";
import { pinterest } from "./platforms/pinterest.js";

// --check: report configuration and exit (handy for setup debugging).
if (process.argv.includes("--check")) {
  const report = Object.fromEntries(
    Object.entries(status).map(([platform, ready]) => [
      platform,
      ready ? "configured" : `NOT configured — ${missingHints[platform]}`,
    ])
  );
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

const server = new McpServer({ name: "ads-mcp-server", version: "0.1.0" });

// Wrap a platform method so its result (or error) is returned as MCP content.
function tool(fn) {
  return async (args) => {
    try {
      const result = await fn(args ?? {});
      return {
        content: [{ type: "text", text: JSON.stringify(result ?? { ok: true }, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: ${err.message}` }],
      };
    }
  };
}

// ---------------------------------------------------------------------------
// Cross-platform: connection status
// ---------------------------------------------------------------------------
server.registerTool(
  "ads_list_connections",
  {
    title: "List ad platform connections",
    description:
      "Show which ad platforms (TikTok, Google, Pinterest) are configured and ready to use, " +
      "and what credentials are missing for the others.",
    inputSchema: {},
  },
  tool(async () => ({
    connections: Object.fromEntries(
      Object.entries(status).map(([platform, ready]) => [
        platform,
        ready ? { ready: true } : { ready: false, hint: missingHints[platform] },
      ])
    ),
  }))
);

// ---------------------------------------------------------------------------
// TikTok
// ---------------------------------------------------------------------------
server.registerTool(
  "tiktok_list_ad_accounts",
  {
    title: "TikTok: list ad accounts",
    description: "List the TikTok advertiser accounts your access token can manage.",
    inputSchema: {},
  },
  tool(() => tiktok.listAdAccounts())
);

server.registerTool(
  "tiktok_list_campaigns",
  {
    title: "TikTok: list campaigns",
    description: "List campaigns for a TikTok advertiser account.",
    inputSchema: {
      advertiser_id: z.string().optional().describe("Advertiser ID (defaults to TIKTOK_ADVERTISER_ID)."),
      page: z.number().int().positive().optional(),
      page_size: z.number().int().positive().max(100).optional(),
    },
  },
  tool((a) => tiktok.listCampaigns({ advertiserId: a.advertiser_id, page: a.page, pageSize: a.page_size }))
);

server.registerTool(
  "tiktok_create_campaign",
  {
    title: "TikTok: create campaign",
    description:
      "Create a TikTok campaign. Note: a campaign is the top-level container; you still need ad " +
      "groups and ads to actually serve. budget is in account currency.",
    inputSchema: {
      advertiser_id: z.string().optional(),
      campaign_name: z.string().describe("Name for the new campaign."),
      objective_type: z
        .string()
        .describe("Campaign objective, e.g. TRAFFIC, REACH, VIDEO_VIEWS, CONVERSIONS, LEAD_GENERATION."),
      budget_mode: z.enum(["BUDGET_MODE_DAY", "BUDGET_MODE_TOTAL", "BUDGET_MODE_INFINITE"]).optional(),
      budget: z.number().positive().optional().describe("Budget amount in account currency."),
    },
  },
  tool((a) =>
    tiktok.createCampaign({
      advertiserId: a.advertiser_id,
      campaignName: a.campaign_name,
      objectiveType: a.objective_type,
      budgetMode: a.budget_mode,
      budget: a.budget,
    })
  )
);

server.registerTool(
  "tiktok_update_campaign_status",
  {
    title: "TikTok: enable/pause/delete campaigns",
    description: "Change the status of one or more TikTok campaigns.",
    inputSchema: {
      advertiser_id: z.string().optional(),
      campaign_ids: z.array(z.string()).min(1).describe("Campaign IDs to update."),
      operation_status: z.enum(["ENABLE", "DISABLE", "DELETE"]),
    },
  },
  tool((a) =>
    tiktok.updateCampaignStatus({
      advertiserId: a.advertiser_id,
      campaignIds: a.campaign_ids,
      operationStatus: a.operation_status,
    })
  )
);

server.registerTool(
  "tiktok_get_report",
  {
    title: "TikTok: performance report",
    description: "Get a basic campaign-level performance report for a date range.",
    inputSchema: {
      advertiser_id: z.string().optional(),
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      metrics: z.array(z.string()).optional(),
      dimensions: z.array(z.string()).optional(),
    },
  },
  tool((a) =>
    tiktok.getReport({
      advertiserId: a.advertiser_id,
      startDate: a.start_date,
      endDate: a.end_date,
      metrics: a.metrics,
      dimensions: a.dimensions,
    })
  )
);

// ---------------------------------------------------------------------------
// Google Ads
// ---------------------------------------------------------------------------
server.registerTool(
  "google_list_ad_accounts",
  {
    title: "Google Ads: list accessible accounts",
    description: "List Google Ads customer accounts accessible to the authenticated user.",
    inputSchema: {},
  },
  tool(() => google.listAdAccounts())
);

server.registerTool(
  "google_list_campaigns",
  {
    title: "Google Ads: list campaigns",
    description: "List campaigns for a Google Ads customer account.",
    inputSchema: {
      customer_id: z.string().optional().describe("Customer ID, digits only (defaults to GOOGLE_ADS_CUSTOMER_ID)."),
    },
  },
  tool((a) => google.listCampaigns({ customerId: a.customer_id }))
);

server.registerTool(
  "google_create_campaign",
  {
    title: "Google Ads: create campaign",
    description:
      "Create a Google Ads campaign (created PAUSED for safety). Also creates a daily budget. " +
      "dailyBudgetMicros is micros: 1,000,000 = 1 unit of account currency.",
    inputSchema: {
      customer_id: z.string().optional(),
      name: z.string(),
      daily_budget_micros: z.number().int().positive().describe("Daily budget in micros (e.g. 10000000 = $10)."),
      channel_type: z
        .enum(["SEARCH", "DISPLAY", "VIDEO", "SHOPPING", "PERFORMANCE_MAX", "DEMAND_GEN"])
        .optional(),
    },
  },
  tool((a) =>
    google.createCampaign({
      customerId: a.customer_id,
      name: a.name,
      dailyBudgetMicros: a.daily_budget_micros,
      channelType: a.channel_type,
    })
  )
);

server.registerTool(
  "google_update_campaign_status",
  {
    title: "Google Ads: enable/pause/remove campaign",
    description: "Change the status of a Google Ads campaign.",
    inputSchema: {
      customer_id: z.string().optional(),
      campaign_id: z.string(),
      status: z.enum(["ENABLED", "PAUSED", "REMOVED"]),
    },
  },
  tool((a) =>
    google.updateCampaignStatus({ customerId: a.customer_id, campaignId: a.campaign_id, status: a.status })
  )
);

server.registerTool(
  "google_get_report",
  {
    title: "Google Ads: performance report",
    description: "Get campaign-level metrics (cost, impressions, clicks, conversions) for a date range.",
    inputSchema: {
      customer_id: z.string().optional(),
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
    },
  },
  tool((a) => google.getReport({ customerId: a.customer_id, startDate: a.start_date, endDate: a.end_date }))
);

// ---------------------------------------------------------------------------
// Pinterest
// ---------------------------------------------------------------------------
server.registerTool(
  "pinterest_list_ad_accounts",
  {
    title: "Pinterest: list ad accounts",
    description: "List Pinterest ad accounts your access token can manage.",
    inputSchema: {},
  },
  tool(() => pinterest.listAdAccounts())
);

server.registerTool(
  "pinterest_list_campaigns",
  {
    title: "Pinterest: list campaigns",
    description: "List campaigns for a Pinterest ad account.",
    inputSchema: {
      ad_account_id: z.string().optional().describe("Defaults to PINTEREST_AD_ACCOUNT_ID."),
      page_size: z.number().int().positive().max(100).optional(),
    },
  },
  tool((a) => pinterest.listCampaigns({ adAccountId: a.ad_account_id, pageSize: a.page_size }))
);

server.registerTool(
  "pinterest_create_campaign",
  {
    title: "Pinterest: create campaign",
    description:
      "Create a Pinterest campaign (created PAUSED for safety). daily_budget_micro is in micro " +
      "currency (1,000,000 = 1 unit).",
    inputSchema: {
      ad_account_id: z.string().optional(),
      name: z.string(),
      objective_type: z
        .enum(["AWARENESS", "CONSIDERATION", "VIDEO_VIEW", "WEB_CONVERSION", "CATALOG_SALES", "WEB_SESSIONS"])
        .describe("Pinterest campaign objective."),
      daily_budget_micro: z.number().int().positive().optional(),
      status: z.enum(["ACTIVE", "PAUSED"]).optional(),
    },
  },
  tool((a) =>
    pinterest.createCampaign({
      adAccountId: a.ad_account_id,
      name: a.name,
      objectiveType: a.objective_type,
      dailyBudgetMicro: a.daily_budget_micro,
      status: a.status,
    })
  )
);

server.registerTool(
  "pinterest_update_campaign_status",
  {
    title: "Pinterest: activate/pause/archive campaign",
    description: "Change the status of a Pinterest campaign.",
    inputSchema: {
      ad_account_id: z.string().optional(),
      campaign_id: z.string(),
      status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]),
    },
  },
  tool((a) =>
    pinterest.updateCampaignStatus({
      adAccountId: a.ad_account_id,
      campaignId: a.campaign_id,
      status: a.status,
    })
  )
);

server.registerTool(
  "pinterest_get_report",
  {
    title: "Pinterest: performance report",
    description: "Get a campaign-level performance report for a date range.",
    inputSchema: {
      ad_account_id: z.string().optional(),
      start_date: z.string().describe("YYYY-MM-DD"),
      end_date: z.string().describe("YYYY-MM-DD"),
      columns: z.array(z.string()).optional(),
      granularity: z.enum(["TOTAL", "DAY", "HOUR", "WEEK", "MONTH"]).optional(),
    },
  },
  tool((a) =>
    pinterest.getReport({
      adAccountId: a.ad_account_id,
      startDate: a.start_date,
      endDate: a.end_date,
      columns: a.columns,
      granularity: a.granularity,
    })
  )
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so we don't corrupt the stdio JSON-RPC stream on stdout.
  console.error("ads-mcp-server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting ads-mcp-server:", err);
  process.exit(1);
});
