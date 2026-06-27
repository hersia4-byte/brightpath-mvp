// TikTok Marketing API logic — full campaign → ad group → creative → ad flow.
// Docs: https://business-api.tiktok.com/portal/docs
//
// Endpoints live under /open_api/v1.3/. Auth is the "Access-Token" header.
// TikTok wraps responses in { code, message, data }; code 0 means success.

import { config, ready, missingHint } from "./config.js";
import { request } from "./request.js";

function ensureReady() {
  if (!ready) throw new Error(`TikTok is not configured. ${missingHint}`);
}

function api(path, { method = "GET", query, body } = {}) {
  ensureReady();
  return request(`${config.baseUrl}/open_api/v1.3${path}`, {
    method,
    query,
    body,
    headers: { "Access-Token": config.accessToken },
  }).then(unwrap);
}

function unwrap(res) {
  if (res && typeof res === "object" && "code" in res) {
    if (res.code !== 0) throw new Error(`TikTok API error ${res.code}: ${res.message}`);
    return res.data;
  }
  return res;
}

function advId(advertiserId) {
  ensureReady();
  const id = advertiserId || config.advertiserId;
  if (!id) {
    throw new Error(
      "No TikTok advertiser_id provided. Pass advertiser_id, set TIKTOK_ADVERTISER_ID, " +
        "or call list_ad_accounts to find one."
    );
  }
  return id;
}

export const tiktok = {
  // ---- Accounts & discovery -------------------------------------------------
  async listAdAccounts() {
    const data = await api("/oauth2/advertiser/get/");
    return data?.list ?? data;
  },

  async listIdentities({ advertiserId } = {}) {
    // Identities are required to attach to ads (the "from" account/page).
    return api("/identity/get/", { query: { advertiser_id: advId(advertiserId) } });
  },

  // ---- Campaign -------------------------------------------------------------
  async listCampaigns({ advertiserId, page = 1, pageSize = 20 } = {}) {
    return api("/campaign/get/", {
      query: { advertiser_id: advId(advertiserId), page, page_size: pageSize },
    });
  },

  async createCampaign({ advertiserId, campaignName, objectiveType, budgetMode = "BUDGET_MODE_DAY", budget, extra = {} }) {
    if (!campaignName) throw new Error("campaignName is required.");
    if (!objectiveType) throw new Error("objectiveType is required (e.g. TRAFFIC, REACH, CONVERSIONS).");
    return api("/campaign/create/", {
      method: "POST",
      body: {
        advertiser_id: advId(advertiserId),
        campaign_name: campaignName,
        objective_type: objectiveType,
        budget_mode: budgetMode,
        ...(budget !== undefined ? { budget } : {}),
        ...extra,
      },
    });
  },

  async updateCampaignStatus({ advertiserId, campaignIds, operationStatus }) {
    if (!campaignIds?.length) throw new Error("campaignIds is required.");
    if (!["ENABLE", "DISABLE", "DELETE"].includes(operationStatus)) {
      throw new Error("operationStatus must be ENABLE, DISABLE, or DELETE.");
    }
    return api("/campaign/status/update/", {
      method: "POST",
      body: { advertiser_id: advId(advertiserId), campaign_ids: campaignIds, operation_status: operationStatus },
    });
  },

  // ---- Ad group -------------------------------------------------------------
  async createAdGroup({
    advertiserId,
    campaignId,
    adgroupName,
    optimizationGoal,
    billingEvent,
    bidType = "BID_TYPE_NO_BID",
    budgetMode = "BUDGET_MODE_DAY",
    budget,
    scheduleType = "SCHEDULE_FROM_NOW",
    scheduleStartTime,
    placementType = "PLACEMENT_TYPE_AUTOMATIC",
    promotionType,
    locationIds,
    extra = {},
  }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!adgroupName) throw new Error("adgroupName is required.");
    if (!optimizationGoal) throw new Error("optimizationGoal is required (e.g. CLICK, CONVERT, REACH).");
    if (!billingEvent) throw new Error("billingEvent is required (e.g. CPC, CPM, OCPM).");
    if (budget === undefined) throw new Error("budget is required for the ad group's daily/total budget.");
    return api("/adgroup/create/", {
      method: "POST",
      body: {
        advertiser_id: advId(advertiserId),
        campaign_id: campaignId,
        adgroup_name: adgroupName,
        optimization_goal: optimizationGoal,
        billing_event: billingEvent,
        bid_type: bidType,
        budget_mode: budgetMode,
        budget,
        schedule_type: scheduleType,
        ...(scheduleStartTime ? { schedule_start_time: scheduleStartTime } : {}),
        placement_type: placementType,
        ...(promotionType ? { promotion_type: promotionType } : {}),
        ...(locationIds ? { location_ids: locationIds } : {}),
        ...extra,
      },
    });
  },

  // ---- Creative assets ------------------------------------------------------
  async uploadImage({ advertiserId, imageUrl, fileName }) {
    if (!imageUrl) throw new Error("imageUrl is required.");
    return api("/file/image/ad/upload/", {
      method: "POST",
      body: {
        advertiser_id: advId(advertiserId),
        upload_type: "UPLOAD_BY_URL",
        image_url: imageUrl,
        ...(fileName ? { file_name: fileName } : {}),
      },
    });
  },

  async uploadVideo({ advertiserId, videoUrl, fileName }) {
    if (!videoUrl) throw new Error("videoUrl is required.");
    return api("/file/video/ad/upload/", {
      method: "POST",
      body: {
        advertiser_id: advId(advertiserId),
        upload_type: "UPLOAD_BY_URL",
        video_url: videoUrl,
        ...(fileName ? { file_name: fileName } : {}),
      },
    });
  },

  // ---- Ad (creative) --------------------------------------------------------
  async createAd({ advertiserId, adgroupId, creatives }) {
    if (!adgroupId) throw new Error("adgroupId is required.");
    if (!creatives?.length) throw new Error("creatives (array) is required.");
    // Each creative typically needs: ad_name, identity_id, identity_type,
    // ad_format, ad_text, call_to_action, landing_page_url, and image_ids
    // or video_id. We pass them through so all ad formats are supported.
    return api("/ad/create/", {
      method: "POST",
      body: { advertiser_id: advId(advertiserId), adgroup_id: adgroupId, creatives },
    });
  },

  // ---- Reporting ------------------------------------------------------------
  async getReport({
    advertiserId,
    startDate,
    endDate,
    metrics = ["spend", "impressions", "clicks", "ctr", "cpc", "conversion"],
    dimensions = ["campaign_id"],
    dataLevel = "AUCTION_CAMPAIGN",
  }) {
    if (!startDate || !endDate) throw new Error("startDate and endDate (YYYY-MM-DD) are required.");
    return api("/report/integrated/get/", {
      query: {
        advertiser_id: advId(advertiserId),
        report_type: "BASIC",
        data_level: dataLevel,
        dimensions,
        metrics,
        start_date: startDate,
        end_date: endDate,
        page: 1,
        page_size: 50,
      },
    });
  },
};
