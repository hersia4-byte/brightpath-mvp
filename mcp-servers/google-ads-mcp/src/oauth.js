// One-click "Connect" OAuth helper for Google Ads.
//
// Flow:
//   GET /auth           -> redirects you to Google's authorization screen
//   GET /auth/callback  -> exchanges the code for a refresh token and shows it
//                          to paste into Render as GOOGLE_ADS_REFRESH_TOKEN.
//
// Uses your existing OAuth client env vars:
//   GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET
// Register this exact redirect URI in the Google Cloud OAuth client:
//   https://<your-service>.onrender.com/auth/callback
//
// Note: a refresh token covers OAuth only. You still need
// GOOGLE_ADS_DEVELOPER_TOKEN (approved by Google) plus
// GOOGLE_ADS_LOGIN_CUSTOMER_ID and GOOGLE_ADS_CUSTOMER_ID.

import { config } from "./config.js";
import { request } from "./request.js";
import { publicBaseUrl, renderTokenPage, escapeHtml } from "./transport.js";

const SCOPE = "https://www.googleapis.com/auth/adwords";

function notConfiguredPage(res, redirectUri) {
  res.writeHead(400, { "Content-Type": "text/html" }).end(
    `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;max-width:680px;margin:40px auto;padding:0 16px">
    <h1>Google Connect isn't set up yet</h1>
    <p>Set these environment variables on this service first, then reload:</p>
    <ul><li><code>GOOGLE_ADS_CLIENT_ID</code></li><li><code>GOOGLE_ADS_CLIENT_SECRET</code></li></ul>
    <p>And in your Google Cloud OAuth client, add this <b>Authorized redirect URI</b>:</p>
    <pre style="background:#f5f5f5;padding:10px;border-radius:8px">${escapeHtml(redirectUri)}</pre>
    </body>`
  );
}

export const routes = [
  {
    path: "/auth",
    handler: async (req, res) => {
      const redirectUri = `${publicBaseUrl(req)}/auth/callback`;
      if (!config.clientId || !config.clientSecret) return notConfiguredPage(res, redirectUri);
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(config.clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code&scope=${encodeURIComponent(SCOPE)}` +
        `&access_type=offline&prompt=consent&state=connect`;
      res.writeHead(302, { Location: authUrl }).end();
    },
  },
  {
    path: "/auth/callback",
    handler: async (req, res, url) => {
      const redirectUri = `${publicBaseUrl(req)}/auth/callback`;
      if (!config.clientId || !config.clientSecret) return notConfiguredPage(res, redirectUri);

      const code = url.searchParams.get("code");
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" }).end("<h1>Missing code in callback</h1>");
        return;
      }

      const tokenRes = await request("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }).toString(),
      });

      if (!tokenRes.refresh_token) {
        throw new Error(
          "Google did not return a refresh_token. Remove this app's access at " +
            "myaccount.google.com/permissions and try /auth again (it forces a fresh consent)."
        );
      }

      res.writeHead(200, { "Content-Type": "text/html" }).end(
        renderTokenPage({
          title: "Google authorized",
          intro: "Copy this into your Render service's Environment tab, then Save.",
          fields: [{ key: "GOOGLE_ADS_REFRESH_TOKEN", value: tokenRes.refresh_token }],
          nextSteps: [
            "Render → this service → <b>Environment</b> → paste GOOGLE_ADS_REFRESH_TOKEN → <b>Save</b>.",
            "Also set GOOGLE_ADS_DEVELOPER_TOKEN (approved by Google), GOOGLE_ADS_LOGIN_CUSTOMER_ID, and GOOGLE_ADS_CUSTOMER_ID (digits only).",
            "Wait ~1 min for the redeploy, then ask Claude: <i>list my Google Ads campaigns</i>.",
          ],
        })
      );
    },
  },
];
