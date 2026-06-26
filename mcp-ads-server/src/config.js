// Centralized configuration loaded from environment variables.
//
// Nothing here throws on startup: a platform is simply considered
// "not configured" if its required credentials are missing. Tools surface
// a friendly message telling the user which variables to set.

const env = process.env;

function clean(value) {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : undefined;
}

export const config = {
  tiktok: {
    accessToken: clean(env.TIKTOK_ACCESS_TOKEN),
    advertiserId: clean(env.TIKTOK_ADVERTISER_ID),
    // Sandbox base URL can be swapped in for testing.
    baseUrl: clean(env.TIKTOK_BASE_URL) || "https://business-api.tiktok.com",
  },
  google: {
    developerToken: clean(env.GOOGLE_ADS_DEVELOPER_TOKEN),
    // Either supply a short-lived access token directly...
    accessToken: clean(env.GOOGLE_ADS_ACCESS_TOKEN),
    // ...or supply a refresh token (+ client id/secret) and we mint one.
    refreshToken: clean(env.GOOGLE_ADS_REFRESH_TOKEN),
    clientId: clean(env.GOOGLE_ADS_CLIENT_ID),
    clientSecret: clean(env.GOOGLE_ADS_CLIENT_SECRET),
    loginCustomerId: clean(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID),
    customerId: clean(env.GOOGLE_ADS_CUSTOMER_ID),
    apiVersion: clean(env.GOOGLE_ADS_API_VERSION) || "v18",
  },
  pinterest: {
    accessToken: clean(env.PINTEREST_ACCESS_TOKEN),
    adAccountId: clean(env.PINTEREST_AD_ACCOUNT_ID),
    baseUrl: clean(env.PINTEREST_BASE_URL) || "https://api.pinterest.com/v5",
  },
};

// Each platform reports whether it has the minimum credentials to make calls.
export const status = {
  tiktok: Boolean(config.tiktok.accessToken),
  google: Boolean(
    config.google.developerToken &&
      (config.google.accessToken ||
        (config.google.refreshToken &&
          config.google.clientId &&
          config.google.clientSecret))
  ),
  pinterest: Boolean(config.pinterest.accessToken),
};

export const missingHints = {
  tiktok: "Set TIKTOK_ACCESS_TOKEN (and optionally TIKTOK_ADVERTISER_ID).",
  google:
    "Set GOOGLE_ADS_DEVELOPER_TOKEN plus either GOOGLE_ADS_ACCESS_TOKEN, or " +
    "GOOGLE_ADS_REFRESH_TOKEN + GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET. " +
    "Also set GOOGLE_ADS_LOGIN_CUSTOMER_ID and GOOGLE_ADS_CUSTOMER_ID.",
  pinterest: "Set PINTEREST_ACCESS_TOKEN (and optionally PINTEREST_AD_ACCOUNT_ID).",
};
