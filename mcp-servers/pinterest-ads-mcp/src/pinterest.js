// Pinterest Ads API (v5) logic — full campaign → ad group → pin → ad flow.
// Docs: https://developers.pinterest.com/docs/api/v5/
//
// Auth is a Bearer token with ads:read / ads:write (and pins:read/write for
// creating pins) scopes.

import { config, ready, missingHint } from "./config.js";
import { request } from "./request.js";

function ensureReady() {
  if (!ready) throw new Error(`Pinterest is not configured. ${missingHint}`);
}

function api(path, { method = "GET", query, body } = {}) {
  ensureReady();
  return request(`${config.baseUrl}${path}`, {
    method,
    query,
    body,
    headers: { Authorization: `Bearer ${config.accessToken}` },
  });
}

function acctId(adAccountId) {
  ensureReady();
  const id = adAccountId || config.adAccountId;
  if (!id) {
    throw new Error(
      "No Pinterest ad_account_id provided. Pass ad_account_id, set PINTEREST_AD_ACCOUNT_ID, " +
        "or call list_ad_accounts to find one."
    );
  }
  return id;
}

export const pinterest = {
  // ---- Accounts -------------------------------------------------------------
  async listAdAccounts() {
    const data = await api("/ad_accounts");
    return data?.items ?? data;
  },

  // ---- Campaign -------------------------------------------------------------
  async listCampaigns({ adAccountId, pageSize = 25 } = {}) {
    const data = await api(`/ad_accounts/${acctId(adAccountId)}/campaigns`, { query: { page_size: pageSize } });
    return data?.items ?? data;
  },

  async createCampaign({ adAccountId, name, objectiveType, dailyBudgetMicro, status = "PAUSED" }) {
    if (!name) throw new Error("name is required.");
    if (!objectiveType) throw new Error("objectiveType is required (e.g. AWARENESS, CONSIDERATION, WEB_CONVERSION).");
    return api(`/ad_accounts/${acctId(adAccountId)}/campaigns`, {
      method: "POST",
      body: [
        {
          name,
          objective_type: objectiveType,
          status,
          ...(dailyBudgetMicro !== undefined ? { daily_spend_cap: dailyBudgetMicro } : {}),
        },
      ],
    });
  },

  async updateCampaignStatus({ adAccountId, campaignId, status }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!["ACTIVE", "PAUSED", "ARCHIVED"].includes(status)) throw new Error("status must be ACTIVE, PAUSED, or ARCHIVED.");
    return api(`/ad_accounts/${acctId(adAccountId)}/campaigns`, {
      method: "PATCH",
      body: [{ id: campaignId, status }],
    });
  },

  // ---- Ad group -------------------------------------------------------------
  async createAdGroup({ adAccountId, campaignId, name, billableEvent = "IMPRESSION", budgetInMicroCurrency, status = "PAUSED", extra = {} }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!name) throw new Error("name is required.");
    return api(`/ad_accounts/${acctId(adAccountId)}/ad_groups`, {
      method: "POST",
      body: [
        {
          campaign_id: campaignId,
          name,
          billable_event: billableEvent,
          status,
          ...(budgetInMicroCurrency !== undefined ? { budget_in_micro_currency: budgetInMicroCurrency } : {}),
          ...extra,
        },
      ],
    });
  },

  // ---- Pin (creative) -------------------------------------------------------
  async listPins({ pageSize = 25 } = {}) {
    const data = await api("/pins", { query: { page_size: pageSize } });
    return data?.items ?? data;
  },

  async createPin({ boardId, title, description, link, imageUrl }) {
    if (!boardId) throw new Error("boardId is required (the board to create the pin on).");
    if (!imageUrl) throw new Error("imageUrl is required.");
    return api("/pins", {
      method: "POST",
      body: {
        board_id: boardId,
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(link ? { link } : {}),
        media_source: { source_type: "image_url", url: imageUrl },
      },
    });
  },

  // ---- Ad -------------------------------------------------------------------
  async createAd({ adAccountId, adGroupId, pinId, name, status = "PAUSED", extra = {} }) {
    if (!adGroupId) throw new Error("adGroupId is required.");
    if (!pinId) throw new Error("pinId is required (the pin to promote).");
    return api(`/ad_accounts/${acctId(adAccountId)}/ads`, {
      method: "POST",
      body: [
        {
          ad_group_id: adGroupId,
          pin_id: pinId,
          status,
          ...(name ? { name } : {}),
          ...extra,
        },
      ],
    });
  },

  // ---- Reporting ------------------------------------------------------------
  async getReport({ adAccountId, startDate, endDate, columns, granularity = "TOTAL" }) {
    if (!startDate || !endDate) throw new Error("startDate and endDate (YYYY-MM-DD) are required.");
    return api(`/ad_accounts/${acctId(adAccountId)}/reports`, {
      method: "POST",
      body: {
        start_date: startDate,
        end_date: endDate,
        granularity,
        columns: columns ?? ["SPEND_IN_DOLLAR", "IMPRESSION_1", "CLICKTHROUGH_1", "TOTAL_CONVERSIONS"],
        level: "CAMPAIGN",
      },
    });
  },
};
