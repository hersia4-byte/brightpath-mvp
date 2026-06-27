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
};

export const ready = Boolean(config.accessToken);

export const missingHint = "Set PINTEREST_ACCESS_TOKEN (and optionally PINTEREST_AD_ACCOUNT_ID).";
