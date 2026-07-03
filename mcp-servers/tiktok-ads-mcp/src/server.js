// Builds the TikTok Ads MCP server and registers all tools.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ready, missingHint } from "./config.js";
import { tiktok } from "./tiktok.js";

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
  const server = new McpServer({ name: "tiktok-ads-mcp", version: "0.1.0" });

  server.registerTool(
    "connection_status",
    { title: "TikTok: connection status", description: "Report whether TikTok credentials are configured.", inputSchema: {} },
    tool(async () => (ready ? { ready: true } : { ready: false, hint: missingHint }))
  );

  server.registerTool(
    "list_ad_accounts",
    { title: "TikTok: list ad accounts", description: "List TikTok advertiser accounts your access token can manage.", inputSchema: {} },
    tool(() => tiktok.listAdAccounts())
  );

  server.registerTool(
    "list_identities",
    {
      title: "TikTok: list identities",
      description: "List identities (the account/page an ad is shown as). Needed to create ads.",
      inputSchema: { advertiser_id: z.string().optional() },
    },
    tool((a) => tiktok.listIdentities({ advertiserId: a.advertiser_id }))
  );

  server.registerTool(
    "list_regions",
    {
      title: "TikTok: list targetable regions",
      description: "List geo location IDs you can target. Use the returned IDs in create_adgroup's location_ids.",
      inputSchema: {
        advertiser_id: z.string().optional(),
        placements: z.array(z.string()).optional().describe("e.g. [\"PLACEMENT_TIKTOK\"]."),
        objective_type: z.string().optional(),
      },
    },
    tool((a) => tiktok.listRegions({ advertiserId: a.advertiser_id, placements: a.placements, objectiveType: a.objective_type }))
  );

  server.registerTool(
    "list_languages",
    {
      title: "TikTok: list targetable languages",
      description: "List language codes you can target. Use them in create_adgroup's languages.",
      inputSchema: { advertiser_id: z.string().optional() },
    },
    tool((a) => tiktok.listLanguages({ advertiserId: a.advertiser_id }))
  );

  server.registerTool(
    "list_interest_categories",
    {
      title: "TikTok: list interest categories",
      description: "List interest category IDs you can target. Use them in create_adgroup's interest_category_ids.",
      inputSchema: {
        advertiser_id: z.string().optional(),
        placement: z.string().optional(),
        version: z.number().int().optional(),
      },
    },
    tool((a) => tiktok.listInterestCategories({ advertiserId: a.advertiser_id, placement: a.placement, version: a.version }))
  );

  server.registerTool(
    "list_campaigns",
    {
      title: "TikTok: list campaigns",
      description: "List campaigns for a TikTok advertiser account.",
      inputSchema: {
        advertiser_id: z.string().optional().describe("Defaults to TIKTOK_ADVERTISER_ID."),
        page: z.number().int().positive().optional(),
        page_size: z.number().int().positive().max(100).optional(),
      },
    },
    tool((a) => tiktok.listCampaigns({ advertiserId: a.advertiser_id, page: a.page, pageSize: a.page_size }))
  );

  server.registerTool(
    "create_campaign",
    {
      title: "TikTok: create campaign",
      description: "Create a TikTok campaign (top-level container). budget is in account currency.",
      inputSchema: {
        advertiser_id: z.string().optional(),
        campaign_name: z.string(),
        objective_type: z.string().describe("e.g. TRAFFIC, REACH, VIDEO_VIEWS, CONVERSIONS, LEAD_GENERATION."),
        budget_mode: z.enum(["BUDGET_MODE_DAY", "BUDGET_MODE_TOTAL", "BUDGET_MODE_INFINITE"]).optional(),
        budget: z.number().positive().optional(),
        extra: z.record(z.any()).optional().describe("Any additional campaign fields to pass through."),
      },
    },
    tool((a) =>
      tiktok.createCampaign({
        advertiserId: a.advertiser_id,
        campaignName: a.campaign_name,
        objectiveType: a.objective_type,
        budgetMode: a.budget_mode,
        budget: a.budget,
        extra: a.extra,
      })
    )
  );

  server.registerTool(
    "update_campaign_status",
    {
      title: "TikTok: enable/pause/delete campaigns",
      description: "Change the status of one or more TikTok campaigns.",
      inputSchema: {
        advertiser_id: z.string().optional(),
        campaign_ids: z.array(z.string()).min(1),
        operation_status: z.enum(["ENABLE", "DISABLE", "DELETE"]),
      },
    },
    tool((a) => tiktok.updateCampaignStatus({ advertiserId: a.advertiser_id, campaignIds: a.campaign_ids, operationStatus: a.operation_status }))
  );

  server.registerTool(
    "create_adgroup",
    {
      title: "TikTok: create ad group",
      description:
        "Create an ad group under a campaign. Ad groups hold targeting, budget, bidding, and schedule. " +
        "Targeting fields are optional (omit to leave unrestricted). Discover valid IDs with list_regions, " +
        "list_languages, and list_interest_categories. Use 'extra' for any objective-specific fields " +
        "(e.g. pixel_id, optimization_event for conversion campaigns).",
      inputSchema: {
        advertiser_id: z.string().optional(),
        campaign_id: z.string(),
        adgroup_name: z.string(),
        optimization_goal: z.string().describe("e.g. CLICK, CONVERT, REACH, VIDEO_VIEW."),
        billing_event: z.string().describe("e.g. CPC, CPM, OCPM."),
        bid_type: z.string().optional().describe("e.g. BID_TYPE_NO_BID (lowest cost) or BID_TYPE_CUSTOM."),
        bid_price: z.number().positive().optional().describe("Required when bid_type is BID_TYPE_CUSTOM."),
        budget_mode: z.enum(["BUDGET_MODE_DAY", "BUDGET_MODE_TOTAL"]).optional(),
        budget: z.number().positive(),
        schedule_type: z.enum(["SCHEDULE_FROM_NOW", "SCHEDULE_START_END"]).optional(),
        schedule_start_time: z.string().optional().describe("YYYY-MM-DD HH:MM:SS"),
        placement_type: z.string().optional(),
        promotion_type: z.string().optional().describe("e.g. WEBSITE, APP, LEAD_GENERATION."),
        // targeting
        location_ids: z.array(z.string()).optional().describe("Geo target location IDs (from list_regions)."),
        age_groups: z.array(z.string()).optional().describe('e.g. ["AGE_18_24","AGE_25_34"].'),
        gender: z.enum(["GENDER_MALE", "GENDER_FEMALE", "GENDER_UNLIMITED"]).optional(),
        languages: z.array(z.string()).optional().describe("Language codes (from list_languages)."),
        interest_category_ids: z.array(z.string()).optional().describe("From list_interest_categories."),
        operating_systems: z.array(z.string()).optional().describe('e.g. ["ANDROID","IOS"].'),
        extra: z.record(z.any()).optional().describe("Any other ad group fields (e.g. pixel_id)."),
      },
    },
    tool((a) =>
      tiktok.createAdGroup({
        advertiserId: a.advertiser_id,
        campaignId: a.campaign_id,
        adgroupName: a.adgroup_name,
        optimizationGoal: a.optimization_goal,
        billingEvent: a.billing_event,
        bidType: a.bid_type,
        bidPrice: a.bid_price,
        budgetMode: a.budget_mode,
        budget: a.budget,
        scheduleType: a.schedule_type,
        scheduleStartTime: a.schedule_start_time,
        placementType: a.placement_type,
        promotionType: a.promotion_type,
        locationIds: a.location_ids,
        ageGroups: a.age_groups,
        gender: a.gender,
        languages: a.languages,
        interestCategoryIds: a.interest_category_ids,
        operatingSystems: a.operating_systems,
        extra: a.extra,
      })
    )
  );

  server.registerTool(
    "upload_image",
    {
      title: "TikTok: upload image creative",
      description: "Upload an image by URL. Returns an image_id to use in create_ad.",
      inputSchema: { advertiser_id: z.string().optional(), image_url: z.string().url(), file_name: z.string().optional() },
    },
    tool((a) => tiktok.uploadImage({ advertiserId: a.advertiser_id, imageUrl: a.image_url, fileName: a.file_name }))
  );

  server.registerTool(
    "upload_video",
    {
      title: "TikTok: upload video creative",
      description: "Upload a video by URL. Returns a video_id to use in create_ad.",
      inputSchema: { advertiser_id: z.string().optional(), video_url: z.string().url(), file_name: z.string().optional() },
    },
    tool((a) => tiktok.uploadVideo({ advertiserId: a.advertiser_id, videoUrl: a.video_url, fileName: a.file_name }))
  );

  server.registerTool(
    "create_ad",
    {
      title: "TikTok: create ad (creative)",
      description:
        "Create one or more ads in an ad group. Each creative needs ad_name, identity_id, identity_type, " +
        "ad_format, ad_text, call_to_action, landing_page_url, and image_ids or video_id (from upload_image/upload_video).",
      inputSchema: {
        advertiser_id: z.string().optional(),
        adgroup_id: z.string(),
        creatives: z.array(z.record(z.any())).min(1).describe("Array of TikTok creative objects."),
      },
    },
    tool((a) => tiktok.createAd({ advertiserId: a.advertiser_id, adgroupId: a.adgroup_id, creatives: a.creatives }))
  );

  server.registerTool(
    "get_report",
    {
      title: "TikTok: performance report",
      description: "Get a performance report for a date range.",
      inputSchema: {
        advertiser_id: z.string().optional(),
        start_date: z.string().describe("YYYY-MM-DD"),
        end_date: z.string().describe("YYYY-MM-DD"),
        metrics: z.array(z.string()).optional(),
        dimensions: z.array(z.string()).optional(),
        data_level: z.enum(["AUCTION_CAMPAIGN", "AUCTION_ADGROUP", "AUCTION_AD"]).optional(),
      },
    },
    tool((a) =>
      tiktok.getReport({
        advertiserId: a.advertiser_id,
        startDate: a.start_date,
        endDate: a.end_date,
        metrics: a.metrics,
        dimensions: a.dimensions,
        dataLevel: a.data_level,
      })
    )
  );

  return server;
}
