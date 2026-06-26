// Google Ads API integration (REST).
// Docs: https://developers.google.com/google-ads/api/rest/overview
//
// Auth requires three things:
//   1. A developer token (from your Google Ads manager account).
//   2. An OAuth2 access token. We accept one directly, or mint one from a
//      refresh token + client id/secret (access tokens expire after ~1h).
//   3. A login-customer-id (your manager account) and the customer id you
//      operate on, both as plain digits (no dashes).

import { config, status, missingHints } from "../config.js";
import { request } from "../http.js";

let cachedToken = { value: undefined, expiresAt: 0 };

function ensureReady() {
  if (!status.google) {
    throw new Error(`Google Ads is not configured. ${missingHints.google}`);
  }
}

async function getAccessToken() {
  // Prefer a directly supplied access token.
  if (config.google.accessToken) return config.google.accessToken;

  // Reuse a freshly minted token until ~1 minute before expiry.
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const res = await request("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      refresh_token: config.google.refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });

  cachedToken = {
    value: res.access_token,
    expiresAt: Date.now() + (res.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

function normalizeId(id) {
  return String(id).replace(/-/g, "");
}

function resolveCustomerId(customerId) {
  ensureReady();
  const id = customerId || config.google.customerId;
  if (!id) {
    throw new Error(
      "No Google Ads customer_id provided. Pass customer_id, set GOOGLE_ADS_CUSTOMER_ID, " +
        "or call google_list_ad_accounts to find one."
    );
  }
  return normalizeId(id);
}

async function api(path, { method = "GET", body } = {}) {
  ensureReady();
  const token = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "developer-token": config.google.developerToken,
  };
  if (config.google.loginCustomerId) {
    headers["login-customer-id"] = normalizeId(config.google.loginCustomerId);
  }
  return request(`https://googleads.googleapis.com/${config.google.apiVersion}${path}`, {
    method,
    body,
    headers,
  });
}

// Run a GAQL query against a customer.
function search(customerId, gaql) {
  return api(`/customers/${resolveCustomerId(customerId)}/googleAds:search`, {
    method: "POST",
    body: { query: gaql },
  });
}

export const google = {
  async listAdAccounts() {
    // Lists customer accounts accessible to the authenticated user.
    const res = await api("/customers:listAccessibleCustomers");
    return res?.resourceNames ?? res;
  },

  async listCampaigns({ customerId } = {}) {
    const res = await search(
      customerId,
      `SELECT campaign.id, campaign.name, campaign.status,
              campaign.advertising_channel_type, campaign_budget.amount_micros
       FROM campaign
       ORDER BY campaign.id
       LIMIT 200`
    );
    return res?.results ?? res;
  },

  async createCampaign({ customerId, name, dailyBudgetMicros, channelType = "SEARCH" }) {
    if (!name) throw new Error("name is required.");
    if (!dailyBudgetMicros) throw new Error("dailyBudgetMicros is required (e.g. 10000000 = $10).");
    const cid = resolveCustomerId(customerId);

    // Step 1: create a shared budget the campaign will reference.
    const budgetRes = await api(`/customers/${cid}/campaignBudgets:mutate`, {
      method: "POST",
      body: {
        operations: [
          {
            create: {
              name: `${name} budget ${Date.now()}`,
              amountMicros: String(dailyBudgetMicros),
              deliveryMethod: "STANDARD",
            },
          },
        ],
      },
    });
    const budgetResource = budgetRes?.results?.[0]?.resourceName;
    if (!budgetResource) {
      throw new Error("Failed to create campaign budget.");
    }

    // Step 2: create the campaign in PAUSED state so nothing spends by accident.
    const campaignRes = await api(`/customers/${cid}/campaigns:mutate`, {
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
    return campaignRes;
  },

  async updateCampaignStatus({ customerId, campaignId, status: newStatus }) {
    if (!campaignId) throw new Error("campaignId is required.");
    if (!["ENABLED", "PAUSED", "REMOVED"].includes(newStatus)) {
      throw new Error("status must be ENABLED, PAUSED, or REMOVED.");
    }
    const cid = resolveCustomerId(customerId);
    const res = await api(`/customers/${cid}/campaigns:mutate`, {
      method: "POST",
      body: {
        operations: [
          {
            update: {
              resourceName: `customers/${cid}/campaigns/${campaignId}`,
              status: newStatus,
            },
            updateMask: "status",
          },
        ],
      },
    });
    return res;
  },

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
