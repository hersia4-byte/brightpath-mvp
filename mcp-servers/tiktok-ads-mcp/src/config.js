// TikTok-only configuration from environment variables.

const env = process.env;

function clean(v) {
  if (v === undefined || v === null) return undefined;
  const t = String(v).trim();
  return t.length ? t : undefined;
}

export const config = {
  accessToken: clean(env.TIKTOK_ACCESS_TOKEN),
  advertiserId: clean(env.TIKTOK_ADVERTISER_ID),
  baseUrl: clean(env.TIKTOK_BASE_URL) || "https://business-api.tiktok.com",
};

export const ready = Boolean(config.accessToken);

export const missingHint = "Set TIKTOK_ACCESS_TOKEN (and optionally TIKTOK_ADVERTISER_ID).";
