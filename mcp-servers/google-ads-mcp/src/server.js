// Builds the Google Ads MCP server and registers all tools.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ready, missingHint } from "./config.js";
import { google } from "./google.js";

function tool(fn) {
  return async (args) => {
    try {
      const result = await fn(args ?? {});
      return { content: [{ type: "text", text: JSON.stringify(result ?? { ok: true }, null, 2) }] };
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  };
}

export function buildServer() {
  const server = new McpServer({ name: "google-ads-mcp", version: "0.1.0" });

  server.registerTool(
    "connection_status",
    { title: "Google Ads: connection status", description: "Report whether Google Ads credentials are configured.", inputSchema: {} },
    tool(async () => (ready ? { ready: true } : { ready: false, hint: missingHint }))
  );

  server.registerTool(
    "list_ad_accounts",
    { title: "Google Ads: list accessible accounts", description: "List Google Ads customer accounts accessible to the authenticated user.", inputSchema: {} },
    tool(() => google.listAdAccounts())
  );

  server.registerTool(
    "list_campaigns",
    {
      title: "Google Ads: list campaigns",
      description: "List campaigns for a Google Ads customer account.",
      inputSchema: { customer_id: z.string().optional().describe("Digits only; defaults to GOOGLE_ADS_CUSTOMER_ID.") },
    },
    tool((a) => google.listCampaigns({ customerId: a.customer_id }))
  );

  server.registerTool(
    "create_campaign",
    {
      title: "Google Ads: create campaign",
      description: "Create a campaign (PAUSED for safety) plus its daily budget. dailyBudgetMicros: 1,000,000 = 1 currency unit.",
      inputSchema: {
        customer_id: z.string().optional(),
        name: z.string(),
        daily_budget_micros: z.number().int().positive().describe("e.g. 10000000 = $10/day."),
        channel_type: z.enum(["SEARCH", "DISPLAY", "VIDEO", "SHOPPING", "PERFORMANCE_MAX", "DEMAND_GEN"]).optional(),
      },
    },
    tool((a) => google.createCampaign({ customerId: a.customer_id, name: a.name, dailyBudgetMicros: a.daily_budget_micros, channelType: a.channel_type }))
  );

  server.registerTool(
    "update_campaign_status",
    {
      title: "Google Ads: enable/pause/remove campaign",
      description: "Change the status of a Google Ads campaign.",
      inputSchema: { customer_id: z.string().optional(), campaign_id: z.string(), status: z.enum(["ENABLED", "PAUSED", "REMOVED"]) },
    },
    tool((a) => google.updateCampaignStatus({ customerId: a.customer_id, campaignId: a.campaign_id, status: a.status }))
  );

  server.registerTool(
    "create_ad_group",
    {
      title: "Google Ads: create ad group",
      description: "Create a Search ad group under a campaign.",
      inputSchema: {
        customer_id: z.string().optional(),
        campaign_id: z.string(),
        name: z.string(),
        cpc_bid_micros: z.number().int().positive().optional().describe("Default CPC bid in micros."),
      },
    },
    tool((a) => google.createAdGroup({ customerId: a.customer_id, campaignId: a.campaign_id, name: a.name, cpcBidMicros: a.cpc_bid_micros }))
  );

  server.registerTool(
    "add_keywords",
    {
      title: "Google Ads: add keywords",
      description: "Add keywords to an ad group.",
      inputSchema: {
        customer_id: z.string().optional(),
        ad_group_id: z.string(),
        keywords: z.array(z.string()).min(1),
        match_type: z.enum(["EXACT", "PHRASE", "BROAD"]).optional(),
      },
    },
    tool((a) => google.addKeywords({ customerId: a.customer_id, adGroupId: a.ad_group_id, keywords: a.keywords, matchType: a.match_type }))
  );

  server.registerTool(
    "create_responsive_search_ad",
    {
      title: "Google Ads: create responsive search ad",
      description: "Create a responsive search ad (PAUSED) in an ad group. Needs 3-15 headlines and 2-4 descriptions.",
      inputSchema: {
        customer_id: z.string().optional(),
        ad_group_id: z.string(),
        final_urls: z.array(z.string().url()).min(1).describe("Landing page URL(s)."),
        headlines: z.array(z.string()).min(3).max(15),
        descriptions: z.array(z.string()).min(2).max(4),
        path1: z.string().optional().describe("Optional display URL path segment."),
        path2: z.string().optional(),
      },
    },
    tool((a) =>
      google.createResponsiveSearchAd({
        customerId: a.customer_id,
        adGroupId: a.ad_group_id,
        finalUrls: a.final_urls,
        headlines: a.headlines,
        descriptions: a.descriptions,
        path1: a.path1,
        path2: a.path2,
      })
    )
  );

  server.registerTool(
    "get_report",
    {
      title: "Google Ads: performance report",
      description: "Get campaign-level metrics (cost, impressions, clicks, conversions) for a date range.",
      inputSchema: { customer_id: z.string().optional(), start_date: z.string().describe("YYYY-MM-DD"), end_date: z.string().describe("YYYY-MM-DD") },
    },
    tool((a) => google.getReport({ customerId: a.customer_id, startDate: a.start_date, endDate: a.end_date }))
  );

  return server;
}
