// TikTok Marketing API integration.
// Docs: https://business-api.tiktok.com/portal/docs
//
// Auth: an "Access-Token" header obtained via TikTok for Business OAuth.
// All endpoints live under /open_api/v1.3/.

import { config, status, missingHints } from "../config.js";
import { request } from "../http.js";

function ensureReady() {
  if (!status.tiktok) {
    throw new Error(`TikTok is not configured. ${missingHints.tiktok}`);
  }
}

function api(path, { method = "GET", query, body } = {}) {
  ensureReady();
  return request(`${config.tiktok.baseUrl}/open_api/v1.3${path}`, {
    method,
    query,
    body,
    headers: { "Access-Token": config.tiktok.accessToken },
  });
}

function resolveAdvertiserId(advertiserId) {
  ensureReady();
  const id = advertiserId || config.tiktok.advertiserId;
  if (!id) {
    throw new Error(
      "No TikTok advertiser_id provided. Pass advertiser_id, set TIKTOK_ADVERTISER_ID, " +
        "or call tiktok_list_ad_accounts to find one."
    );
  }
  return id;
}

// TikTok wraps responses in { code, message, data }. code 0 means success.
function unwrap(res) {
  if (res && typeof res === "object" && "code" in res) {
    if (res.code !== 0) {
      throw new Error(`TikTok API error ${res.code}: ${res.message}`);
    }
    return res.data;
  }
  return res;
}

export const tiktok = {
  async listAdAccounts() {
    // Returns the advertiser accounts the token can access.
    const data = unwrap(await api("/oauth2/advertiser/get/"));
    return data?.list ?? data;
  },

  async listCampaigns({ advertiserId, page = 1, pageSize = 20 } = {}) {
    const data = unwrap(
      await api("/campaign/get/", {
        query: {
          advertiser_id: resolveAdvertiserId(advertiserId),
          page,
          page_size: pageSize,
        },
      })
    );
    return data;
  },

  async createCampaign({
    advertiserId,
    campaignName,
    objectiveType,
    budgetMode = "BUDGET_MODE_DAY",
    budget,
  }) {
    if (!campaignName) throw new Error("campaignName is required.");
    if (!objectiveType) throw new Error("objectiveType is required (e.g. TRAFFIC, REACH, CONVERSIONS).");
    const data = unwrap(
      await api("/campaign/create/", {
        method: "POST",
        body: {
          advertiser_id: resolveAdvertiserId(advertiserId),
          campaign_name: campaignName,
          objective_type: objectiveType,
          budget_mode: budgetMode,
          ...(budget !== undefined ? { budget } : {}),
        },
      })
    );
    return data;
  },

  async updateCampaignStatus({ advertiserId, campaignIds, operationStatus }) {
    if (!campaignIds?.length) throw new Error("campaignIds is required.");
    if (!["ENABLE", "DISABLE", "DELETE"].includes(operationStatus)) {
      throw new Error("operationStatus must be ENABLE, DISABLE, or DELETE.");
    }
    const data = unwrap(
      await api("/campaign/status/update/", {
        method: "POST",
        body: {
          advertiser_id: resolveAdvertiserId(advertiserId),
          campaign_ids: campaignIds,
          operation_status: operationStatus,
        },
      })
    );
    return data;
  },

  async getReport({
    advertiserId,
    startDate,
    endDate,
    metrics = ["spend", "impressions", "clicks", "ctr", "cpc", "conversion"],
    dimensions = ["campaign_id"],
  }) {
    if (!startDate || !endDate) throw new Error("startDate and endDate (YYYY-MM-DD) are required.");
    const data = unwrap(
      await api("/report/integrated/get/", {
        query: {
          advertiser_id: resolveAdvertiserId(advertiserId),
          report_type: "BASIC",
          data_level: "AUCTION_CAMPAIGN",
          dimensions,
          metrics,
          start_date: startDate,
          end_date: endDate,
          page: 1,
          page_size: 50,
        },
      })
    );
    return data;
  },
};
