// One-click "Connect" OAuth helper for TikTok Marketing API.
//
// Flow:
//   GET /auth           -> redirects you to TikTok's authorization screen
//   GET /auth/callback  -> exchanges the returned auth_code for an access token
//                          and shows it (plus your advertiser IDs) to paste into
//                          Render as TIKTOK_ACCESS_TOKEN / TIKTOK_ADVERTISER_ID.
//
// Requires these env vars (from your TikTok developer app):
//   TIKTOK_APP_ID, TIKTOK_APP_SECRET
// And register this exact redirect URI in the app:
//   https://<your-service>.onrender.com/auth/callback

import { config } from "./config.js";
import { request } from "./request.js";
import { publicBaseUrl, renderTokenPage, escapeHtml } from "./transport.js";

const env = process.env;
const appId = env.TIKTOK_APP_ID?.trim();
const appSecret = env.TIKTOK_APP_SECRET?.trim();

function notConfiguredPage(res, redirectUri) {
  res.writeHead(400, { "Content-Type": "text/html" }).end(
    `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;max-width:680px;margin:40px auto;padding:0 16px">
    <h1>TikTok Connect isn't set up yet</h1>
    <p>Set these environment variables on this service first, then reload:</p>
    <ul><li><code>TIKTOK_APP_ID</code></li><li><code>TIKTOK_APP_SECRET</code></li></ul>
    <p>And in your TikTok app settings, add this <b>redirect URI</b>:</p>
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
        `https://business-api.tiktok.com/portal/auth?app_id=${encodeURIComponent(appId)}` +
        `&state=connect&redirect_uri=${encodeURIComponent(redirectUri)}`;
      res.writeHead(302, { Location: authUrl }).end();
    },
  },
  {
    path: "/auth/callback",
    handler: async (req, res, url) => {
      const redirectUri = `${publicBaseUrl(req)}/auth/callback`;
      if (!appId || !appSecret) return notConfiguredPage(res, redirectUri);

      const authCode = url.searchParams.get("auth_code") || url.searchParams.get("code");
      if (!authCode) {
        res.writeHead(400, { "Content-Type": "text/html" }).end("<h1>Missing auth_code in callback</h1>");
        return;
      }

      const result = await request(`${config.baseUrl}/open_api/v1.3/oauth2/access_token/`, {
        method: "POST",
        body: { app_id: appId, secret: appSecret, auth_code: authCode },
      });
      if (result?.code !== 0) {
        throw new Error(`TikTok token exchange failed: ${result?.message || JSON.stringify(result)}`);
      }
      const data = result.data || {};
      const advertiserIds = Array.isArray(data.advertiser_ids) ? data.advertiser_ids.join(", ") : "";

      res.writeHead(200, { "Content-Type": "text/html" }).end(
        renderTokenPage({
          title: "TikTok connected",
          intro: "Copy these into your Render service's Environment tab, then Save.",
          fields: [
            { key: "TIKTOK_ACCESS_TOKEN", value: data.access_token },
            { key: "TIKTOK_ADVERTISER_ID", value: advertiserIds },
          ],
          nextSteps: [
            "Render → this service → <b>Environment</b> → paste the values above → <b>Save</b>.",
            "If TIKTOK_ADVERTISER_ID has several IDs, keep just the one you want to manage.",
            "Wait ~1 min for the redeploy, then ask Claude: <i>list my TikTok campaigns</i>.",
          ],
        })
      );
    },
  },
];
