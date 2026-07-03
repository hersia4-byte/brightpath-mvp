// Google Ads API logic (REST) — full campaign → ad group → keywords → ad flow.
// Docs: https://developers.google.com/google-ads/api/rest/overview

import { config, ready, missingHint } from "./config.js";
import { request } from "./request.js";

let cachedToken = { value: undefined, expiresAt: 0 };

function ensureReady() {
  if (!ready) throw new Error(`Google Ads is not configured. ${missingHint}`);
}

async function getAccessToken() {
  if (config.accessToken) return config.accessToken;
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.value;

  const res = await request("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });
  cachedToken = { value: res.access_token, expiresAt: Date.now() + (res.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

const normalizeId = (id) => String(id).replace(/-/g, "");

function resolveCustomerId(customerId) {
  ensureReady();
  const id = customerId || config.customerId;
  if (!id) {
    throw new Error(
      "No Google Ads customer_id provided. Pass customer_id, set GOOGLE_ADS_CUSTOMER_ID, " +
        "or call list_ad_accounts to find one."
    );
  }
  return normalizeId(id);
}

async function api(path, { method = "GET", body } = {}) {
  ensureReady();
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}`, "developer-token": config.developerToken };
  if (config.loginCustomerId) headers["login-customer-id"] = normalizeId(config.loginCustomerId);
  return request(`https://googleads.googleapis.com/${config.apiVersion}${path}`, { method, body, headers });
}

function search(customerId, gaql) {
  return api(`/customers/${resolveCustomerId(customerId)}/googleAds:search`, {
    method: "POST",
    body: { query: gaql },
  });
}

export const google = {
  // ---- Accounts -------------------------------------------------------------
  async listAdAccounts() {
    const res = await api("/customers:listAccessibleCustomers");
    return res?.resourceNames ?? res;
  },

  // ---- Campaign -------------------------------------------------------------
  async listCampaigns({ customerId } = {}) {
    const res = await search(
      customerId,
      `SELECT campaign.id, campaign.name, campaign.status,
              campaign.advertising_channel_type, campaign_budget.amount_micros
       FROM campaign ORDER BY campaign.id LIMIT 200`
    );
    return res?.results ?? res;
  },

  async createCampaign({ customerId, name, dailyBudgetMicros, channelType = "SEARCH" }) {
    if (!name) throw new Error("name is required.");
    if (!dailyBudgetMicros) throw new Error("dailyBudgetMicros is required (1,000,000 = 1 currency unit).");
    const cid = resolveCustomerId(customerId);

    const budgetRes = await api(`/customers/${cid}/campaignBudgets:mutate`, {
      method: "POST",
      body: {
        operations: [
          { create: { name: `${name} budget ${Date.now()}`, amountMicros: String(dailyBudgetMicros), deliveryMethod: "STANDARD" } },
        ],
      },
    });
    const budgetResource = budgetRes?.results?.[0]?.resourceName;
    if (!budgetResource) throw new Error("Failed to create campaign budget.");

    return api(`/customers/${cid}/campaigns:mutate`, {
      method: "POST",
      body: {
        operations: [
          {
            create: {
              name,
              status: "PAUSED",
              advertisingChannelType: channelType,
              campaignBudget: budgetResource,
              manualCpc: {},
            },
          },
        ],
      },
    });
  },

  async updateCampaignStatus({ customerId, campaignId, status }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!["ENABLED", "PAUSED", "REMOVED"].includes(status)) throw new Error("status must be ENABLED, PAUSED, or REMOVED.");
    const cid = resolveCustomerId(customerId);
    return api(`/customers/${cid}/campaigns:mutate`, {
      method: "POST",
      body: {
        operations: [
          { update: { resourceName: `customers/${cid}/campaigns/${campaignId}`, status }, updateMask: "status" },
        ],
      },
    });
  },

  // ---- Ad group -------------------------------------------------------------
  async createAdGroup({ customerId, campaignId, name, cpcBidMicros }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!name) throw new Error("name is required.");
    const cid = resolveCustomerId(customerId);
    return api(`/customers/${cid}/adGroups:mutate`, {
      method: "POST",
      body: {
        operations: [
          {
            create: {
              name,
              status: "ENABLED",
              campaign: `customers/${cid}/campaigns/${campaignId}`,
              type: "SEARCH_STANDARD",
              ...(cpcBidMicros ? { cpcBidMicros: String(cpcBidMicros) } : {}),
            },
          },
        ],
      },
    });
  },

  // ---- Keywords -------------------------------------------------------------
  async addKeywords({ customerId, adGroupId, keywords, matchType = "BROAD" }) {
    if (!adGroupId) throw new Error("adGroupId is required.");
    if (!keywords?.length) throw new Error("keywords (array of strings) is required.");
    if (!["EXACT", "PHRASE", "BROAD"].includes(matchType)) throw new Error("matchType must be EXACT, PHRASE, or BROAD.");
    const cid = resolveCustomerId(customerId);
    return api(`/customers/${cid}/adGroupCriteria:mutate`, {
      method: "POST",
      body: {
        operations: keywords.map((text) => ({
          create: {
            adGroup: `customers/${cid}/adGroups/${adGroupId}`,
            status: "ENABLED",
            keyword: { text, matchType },
          },
        })),
      },
    });
  },

  // ---- Ad (responsive search ad) -------------------------------------------
  async createResponsiveSearchAd({ customerId, adGroupId, finalUrls, headlines, descriptions, path1, path2 }) {
    if (!adGroupId) throw new Error("adGroupId is required.");
    if (!finalUrls?.length) throw new Error("finalUrls (array) is required.");
    if (!headlines || headlines.length < 3) throw new Error("Provide at least 3 headlines (max 15).");
    if (!descriptions || descriptions.length < 2) throw new Error("Provide at least 2 descriptions (max 4).");
    const cid = resolveCustomerId(customerId);
    return api(`/customers/${cid}/adGroupAds:mutate`, {
      method: "POST",
      body: {
        operations: [
          {
            create: {
              adGroup: `customers/${cid}/adGroups/${adGroupId}`,
              status: "PAUSED",
              ad: {
                finalUrls,
                responsiveSearchAd: {
                  headlines: headlines.map((text) => ({ text })),
                  descriptions: descriptions.map((text) => ({ text })),
                  ...(path1 ? { path1 } : {}),
                  ...(path2 ? { path2 } : {}),
                },
              },
            },
          },
        ],
      },
    });
  },

  // ---- Reporting ------------------------------------------------------------
  async getReport({ customerId, startDate, endDate }) {
    if (!startDate || !endDate) throw new Error("startDate and endDate (YYYY-MM-DD) are required.");
    const res = await search(
      customerId,
      `SELECT campaign.id, campaign.name,
              metrics.cost_micros, metrics.impressions, metrics.clicks,
              metrics.ctr, metrics.average_cpc, metrics.conversions
       FROM campaign
       WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
       ORDER BY metrics.cost_micros DESC`
    );
    return res?.results ?? res;
  },
};
