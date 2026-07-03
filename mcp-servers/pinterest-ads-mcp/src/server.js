// Builds the Pinterest Ads MCP server and registers all tools.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ready, missingHint } from "./config.js";
import { pinterest } from "./pinterest.js";

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
  const server = new McpServer({ name: "pinterest-ads-mcp", version: "0.1.0" });

  server.registerTool(
    "connection_status",
    { title: "Pinterest: connection status", description: "Report whether Pinterest credentials are configured.", inputSchema: {} },
    tool(async () => (ready ? { ready: true } : { ready: false, hint: missingHint }))
  );

  server.registerTool(
    "list_ad_accounts",
    { title: "Pinterest: list ad accounts", description: "List Pinterest ad accounts your access token can manage.", inputSchema: {} },
    tool(() => pinterest.listAdAccounts())
  );

  server.registerTool(
    "list_campaigns",
    {
      title: "Pinterest: list campaigns",
      description: "List campaigns for a Pinterest ad account.",
      inputSchema: { ad_account_id: z.string().optional().describe("Defaults to PINTEREST_AD_ACCOUNT_ID."), page_size: z.number().int().positive().max(100).optional() },
    },
    tool((a) => pinterest.listCampaigns({ adAccountId: a.ad_account_id, pageSize: a.page_size }))
  );

  server.registerTool(
    "create_campaign",
    {
      title: "Pinterest: create campaign",
      description: "Create a campaign (PAUSED for safety). daily_budget_micro is in micro currency (1,000,000 = 1 unit).",
      inputSchema: {
        ad_account_id: z.string().optional(),
        name: z.string(),
        objective_type: z.enum(["AWARENESS", "CONSIDERATION", "VIDEO_VIEW", "WEB_CONVERSION", "CATALOG_SALES", "WEB_SESSIONS"]),
        daily_budget_micro: z.number().int().positive().optional(),
        status: z.enum(["ACTIVE", "PAUSED"]).optional(),
      },
    },
    tool((a) => pinterest.createCampaign({ adAccountId: a.ad_account_id, name: a.name, objectiveType: a.objective_type, dailyBudgetMicro: a.daily_budget_micro, status: a.status }))
  );

  server.registerTool(
    "update_campaign_status",
    {
      title: "Pinterest: activate/pause/archive campaign",
      description: "Change the status of a Pinterest campaign.",
      inputSchema: { ad_account_id: z.string().optional(), campaign_id: z.string(), status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]) },
    },
    tool((a) => pinterest.updateCampaignStatus({ adAccountId: a.ad_account_id, campaignId: a.campaign_id, status: a.status }))
  );

  server.registerTool(
    "create_ad_group",
    {
      title: "Pinterest: create ad group",
      description: "Create an ad group (PAUSED) under a campaign. budget_in_micro_currency: 1,000,000 = 1 unit.",
      inputSchema: {
        ad_account_id: z.string().optional(),
        campaign_id: z.string(),
        name: z.string(),
        billable_event: z.enum(["IMPRESSION", "CLICKTHROUGH", "VIDEO_V_50_MRC"]).optional(),
        budget_in_micro_currency: z.number().int().positive().optional(),
        status: z.enum(["ACTIVE", "PAUSED"]).optional(),
        extra: z.record(z.any()).optional().describe("Targeting and other ad group fields."),
      },
    },
    tool((a) =>
      pinterest.createAdGroup({
        adAccountId: a.ad_account_id,
        campaignId: a.campaign_id,
        name: a.name,
        billableEvent: a.billable_event,
        budgetInMicroCurrency: a.budget_in_micro_currency,
        status: a.status,
        extra: a.extra,
      })
    )
  );

  server.registerTool(
    "list_pins",
    {
      title: "Pinterest: list pins",
      description: "List your pins (creatives you can promote as ads).",
      inputSchema: { page_size: z.number().int().positive().max(100).optional() },
    },
    tool((a) => pinterest.listPins({ pageSize: a.page_size }))
  );

  server.registerTool(
    "create_pin",
    {
      title: "Pinterest: create pin (creative)",
      description: "Create a pin from an image URL on one of your boards. Returns a pin id to promote via create_ad.",
      inputSchema: {
        board_id: z.string(),
        image_url: z.string().url(),
        title: z.string().optional(),
        description: z.string().optional(),
        link: z.string().url().optional().describe("Destination URL when the pin is clicked."),
      },
    },
    tool((a) => pinterest.createPin({ boardId: a.board_id, imageUrl: a.image_url, title: a.title, description: a.description, link: a.link }))
  );

  server.registerTool(
    "create_ad",
    {
      title: "Pinterest: create ad",
      description: "Promote a pin as an ad within an ad group (PAUSED for safety).",
      inputSchema: {
        ad_account_id: z.string().optional(),
        ad_group_id: z.string(),
        pin_id: z.string(),
        name: z.string().optional(),
        status: z.enum(["ACTIVE", "PAUSED"]).optional(),
        extra: z.record(z.any()).optional(),
      },
    },
    tool((a) => pinterest.createAd({ adAccountId: a.ad_account_id, adGroupId: a.ad_group_id, pinId: a.pin_id, name: a.name, status: a.status, extra: a.extra }))
  );

  server.registerTool(
    "get_report",
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
    tool((a) => pinterest.getReport({ adAccountId: a.ad_account_id, startDate: a.start_date, endDate: a.end_date, columns: a.columns, granularity: a.granularity }))
  );

  return server;
}
