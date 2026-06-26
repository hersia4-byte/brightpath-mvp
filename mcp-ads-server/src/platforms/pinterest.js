// Pinterest Ads API (v5) integration.
// Docs: https://developers.pinterest.com/docs/api/v5/
//
// Auth: a Bearer access token with the ads:read / ads:write scopes.

import { config, status, missingHints } from "../config.js";
import { request } from "../http.js";

function ensureReady() {
  if (!status.pinterest) {
    throw new Error(`Pinterest is not configured. ${missingHints.pinterest}`);
  }
}

function api(path, { method = "GET", query, body } = {}) {
  ensureReady();
  return request(`${config.pinterest.baseUrl}${path}`, {
    method,
    query,
    body,
    headers: { Authorization: `Bearer ${config.pinterest.accessToken}` },
  });
}

function resolveAdAccountId(adAccountId) {
  ensureReady();
  const id = adAccountId || config.pinterest.adAccountId;
  if (!id) {
    throw new Error(
      "No Pinterest ad_account_id provided. Pass ad_account_id, set PINTEREST_AD_ACCOUNT_ID, " +
        "or call pinterest_list_ad_accounts to find one."
    );
  }
  return id;
}

export const pinterest = {
  async listAdAccounts() {
    const data = await api("/ad_accounts");
    return data?.items ?? data;
  },

  async listCampaigns({ adAccountId, pageSize = 25 } = {}) {
    const id = resolveAdAccountId(adAccountId);
    const data = await api(`/ad_accounts/${id}/campaigns`, {
      query: { page_size: pageSize },
    });
    return data?.items ?? data;
  },

  async createCampaign({
    adAccountId,
    name,
    objectiveType,
    dailyBudgetMicro,
    status: campaignStatus = "PAUSED",
  }) {
    if (!name) throw new Error("name is required.");
    if (!objectiveType)
      throw new Error("objectiveType is required (e.g. AWARENESS, CONSIDERATION, WEB_CONVERSION).");
    const id = resolveAdAccountId(adAccountId);
    // The campaigns endpoint accepts an array of campaign objects.
    const data = await api(`/ad_accounts/${id}/campaigns`, {
      method: "POST",
      body: [
        {
          name,
          objective_type: objectiveType,
          status: campaignStatus,
          ...(dailyBudgetMicro !== undefined
            ? { daily_spend_cap: dailyBudgetMicro }
            : {}),
        },
      ],
    });
    return data;
  },

  async updateCampaignStatus({ adAccountId, campaignId, status: newStatus }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!["ACTIVE", "PAUSED", "ARCHIVED"].includes(newStatus)) {
      throw new Error("status must be ACTIVE, PAUSED, or ARCHIVED.");
    }
    const id = resolveAdAccountId(adAccountId);
    const data = await api(`/ad_accounts/${id}/campaigns`, {
      method: "PATCH",
      body: [{ id: campaignId, status: newStatus }],
    });
    return data;
  },

  async getReport({ adAccountId, startDate, endDate, columns, granularity = "TOTAL" }) {
    if (!startDate || !endDate) throw new Error("startDate and endDate (YYYY-MM-DD) are required.");
    const id = resolveAdAccountId(adAccountId);
    const data = await api(`/ad_accounts/${id}/reports`, {
      method: "POST",
      body: {
        start_date: startDate,
        end_date: endDate,
        granularity,
        columns: columns ?? ["SPEND_IN_DOLLAR", "IMPRESSION_1", "CLICKTHROUGH_1", "TOTAL_CONVERSIONS"],
        level: "CAMPAIGN",
      },
    });
    return data;
  },
};
