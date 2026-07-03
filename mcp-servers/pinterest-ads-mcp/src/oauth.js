// One-click "Connect" OAuth helper for Pinterest API v5.
//
// Flow:
//   GET /auth           -> redirects you to Pinterest's authorization screen
//   GET /auth/callback  -> exchanges the code for an access token and shows it
//                          to paste into Render as PINTEREST_ACCESS_TOKEN.
//
// Requires these env vars (from your Pinterest developer app):
//   PINTEREST_APP_ID, PINTEREST_APP_SECRET
// And register this exact redirect URI in the app:
//   https://<your-service>.onrender.com/auth/callback

import { config } from "./config.js";
import { request } from "./request.js";
import { publicBaseUrl, renderTokenPage, escapeHtml } from "./transport.js";

const env = process.env;
const appId = env.PINTEREST_APP_ID?.trim();
const appSecret = env.PINTEREST_APP_SECRET?.trim();
const SCOPES = "ads:read,ads:write,pins:read,pins:write,boards:read,user_accounts:read";

function notConfiguredPage(res, redirectUri) {
  res.writeHead(400, { "Content-Type": "text/html" }).end(
    `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;max-width:680px;margin:40px auto;padding:0 16px">
    <h1>Pinterest Connect isn't set up yet</h1>
    <p>Set these environment variables on this service first, then reload:</p>
    <ul><li><code>PINTEREST_APP_ID</code></li><li><code>PINTEREST_APP_SECRET</code></li></ul>
    <p>And in your Pinterest app settings, add this <b>redirect URI</b>:</p>
    <pre style="background:#f5f5f5;padding:10px;border-radius:8px">${escapeHtml(redirectUri)}</pre>
    </body>`
  );
}

export const routes = [
  {
    path: "/auth",
    handler: async (req, res) => {
      const redirectUri = `${publicBaseUrl(req)}/auth/callback`;
      if (!appId || !appSecret) return notConfiguredPage(res, redirectUri);
      const authUrl =
        `https://www.pinterest.com/oauth/?client_id=${encodeURIComponent(appId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code&scope=${encodeURIComponent(SCOPES)}&state=connect`;
      res.writeHead(302, { Location: authUrl }).end();
    },
  },
  {
    path: "/auth/callback",
    handler: async (req, res, url) => {
      const redirectUri = `${publicBaseUrl(req)}/auth/callback`;
      if (!appId || !appSecret) return notConfiguredPage(res, redirectUri);

      const code = url.searchParams.get("code");
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" }).end("<h1>Missing code in callback</h1>");
        return;
      }

      const basic = Buffer.from(`${appId}:${appSecret}`).toString("base64");
      const tokenRes = await request(`${config.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }).toString(),
      });

      // Try to look up the ad account id for convenience (best-effort).
      let adAccountId = "";
      try {
        const accts = await request(`${config.baseUrl}/ad_accounts`, {
          headers: { Authorization: `Bearer ${tokenRes.access_token}` },
        });
        adAccountId = accts?.items?.[0]?.id || "";
      } catch {
        /* ignore — user can fill this in manually */
      }

      res.writeHead(200, { "Content-Type": "text/html" }).end(
        renderTokenPage({
          title: "Pinterest connected",
          intro:
            "Copy these into your Render service's Environment tab, then Save. " +
            "Set PINTEREST_REFRESH_TOKEN (plus PINTEREST_APP_ID/SECRET, already set) so the " +
            "token auto-refreshes and never expires.",
          fields: [
            { key: "PINTEREST_REFRESH_TOKEN", value: tokenRes.refresh_token },
            { key: "PINTEREST_ACCESS_TOKEN", value: tokenRes.access_token },
            { key: "PINTEREST_AD_ACCOUNT_ID", value: adAccountId },
          ],
          nextSteps: [
            "Render → this service → <b>Environment</b> → set <b>PINTEREST_REFRESH_TOKEN</b> to the value above → <b>Save</b>. (This is the important one — it keeps you logged in.)",
            "You can also set PINTEREST_ACCESS_TOKEN, but with the refresh token the server mints fresh ones automatically.",
            "If PINTEREST_AD_ACCOUNT_ID is blank, ask Claude to <i>list my Pinterest ad accounts</i> and pick one.",
            "Wait ~1 min for the redeploy, then ask Claude: <i>list my Pinterest campaigns</i>.",
          ],
        })
      );
    },
  },
];
