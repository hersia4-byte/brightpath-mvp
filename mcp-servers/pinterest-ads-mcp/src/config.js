// Pinterest-only configuration from environment variables.

const env = process.env;

function clean(v) {
  if (v === undefined || v === null) return undefined;
  const t = String(v).trim();
  return t.length ? t : undefined;
}

export const config = {
  accessToken: clean(env.PINTEREST_ACCESS_TOKEN),
  adAccountId: clean(env.PINTEREST_AD_ACCOUNT_ID),
  baseUrl: clean(env.PINTEREST_BASE_URL) || "https://api.pinterest.com/v5",
  // For auto-refresh: a refresh token + app credentials let the server mint
  // fresh access tokens automatically, so it never expires on you.
  refreshToken: clean(env.PINTEREST_REFRESH_TOKEN),
  appId: clean(env.PINTEREST_APP_ID),
  appSecret: clean(env.PINTEREST_APP_SECRET),
};

// Ready if we have a static access token, OR a refresh token + app creds.
export const ready = Boolean(
  config.accessToken || (config.refreshToken && config.appId && config.appSecret)
);

export const missingHint =
  "Set PINTEREST_ACCESS_TOKEN, or (recommended) PINTEREST_REFRESH_TOKEN + " +
  "PINTEREST_APP_ID + PINTEREST_APP_SECRET so tokens auto-refresh.";
