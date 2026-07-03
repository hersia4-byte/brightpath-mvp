// Google Ads-only configuration from environment variables.

const env = process.env;

function clean(v) {
  if (v === undefined || v === null) return undefined;
  const t = String(v).trim();
  return t.length ? t : undefined;
}

export const config = {
  developerToken: clean(env.GOOGLE_ADS_DEVELOPER_TOKEN),
  accessToken: clean(env.GOOGLE_ADS_ACCESS_TOKEN),
  refreshToken: clean(env.GOOGLE_ADS_REFRESH_TOKEN),
  clientId: clean(env.GOOGLE_ADS_CLIENT_ID),
  clientSecret: clean(env.GOOGLE_ADS_CLIENT_SECRET),
  loginCustomerId: clean(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID),
  customerId: clean(env.GOOGLE_ADS_CUSTOMER_ID),
  apiVersion: clean(env.GOOGLE_ADS_API_VERSION) || "v18",
};

export const ready = Boolean(
  config.developerToken &&
    (config.accessToken || (config.refreshToken && config.clientId && config.clientSecret))
);

export const missingHint =
  "Set GOOGLE_ADS_DEVELOPER_TOKEN plus either GOOGLE_ADS_ACCESS_TOKEN, or " +
  "GOOGLE_ADS_REFRESH_TOKEN + GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET. " +
  "Also set GOOGLE_ADS_LOGIN_CUSTOMER_ID and GOOGLE_ADS_CUSTOMER_ID.";
