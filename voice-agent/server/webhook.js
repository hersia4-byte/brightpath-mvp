// Webhook server for the Vapi assistant.
// Handles tool calls (checkAvailability, bookAppointment, takeMessage) and
// end-of-call reports. Booking logic lives in scheduler.js.
//
//   node webhook.js            # listens on :3100
//   PORT=8080 node webhook.js
//
// Business hours/slots are configured in config.json. Bookings persist in
// ./data/bookings.json; messages and call reports in ./data/*.jsonl.
// Wire real notifications and calendars where marked TODO — see
// docs/INTEGRATIONS.md for the Google Calendar / Cal.com / Twilio recipes.
//
// Deploy anywhere with a public HTTPS URL (Railway, Render, Fly, a VPS),
// then set that URL in assistant.json (server.url and each tool's
// server.url), e.g. https://your-host/vapi/tools and /vapi/events.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkAvailability, bookAppointment } from './scheduler.js';

const PORT = process.env.PORT || 3100;
const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

function appendRecord(kind, record) {
  const line = JSON.stringify({ receivedAt: new Date().toISOString(), ...record }) + '\n';
  fs.appendFileSync(path.join(DATA_DIR, `${kind}.jsonl`), line);
}

// --- Tool implementations ---------------------------------------------------
// Each returns a string: the instruction spoken context sent back to the LLM.

const TOOLS = {
  checkAvailability(args, callId) {
    const result = checkAvailability(args);
    appendRecord('availability-checks', { callId, args, result });
    return result.speech;
  },

  bookAppointment(args, callId) {
    const result = bookAppointment(args);
    appendRecord('appointments', { callId, args, result });
    if (result.booked) {
      // TODO: push to the client's calendar (Google Calendar / Cal.com) and
      // TODO: text the owner + the caller (Twilio) — see docs/INTEGRATIONS.md.
      console.log(`APPOINTMENT ${result.confirmationId}:`, args.callerName, result.date, result.time);
    }
    return result.speech;
  },

  takeMessage(args, callId) {
    appendRecord('messages', { callId, ...args });
    // TODO: forward to the client's email; SMS the owner for urgent categories.
    console.log(`MESSAGE [${args.category}]:`, args);
    return 'Message recorded. Tell the caller the team will follow up promptly.';
  },
};

// --- HTTP plumbing -----------------------------------------------------------

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Voice agent webhook is up.\n');
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    res.writeHead(400);
    return res.end('bad json');
  }

  const message = payload.message || {};
  const callId = message.call?.id;

  // Vapi sends tool calls as message.type === "tool-calls" with a list of
  // toolCallList items; it expects { results: [{ toolCallId, result }] }.
  if (req.url === '/vapi/tools' || message.type === 'tool-calls') {
    const toolCalls = message.toolCallList || message.toolCalls || [];
    const results = toolCalls.map((tc) => {
      const name = tc.function?.name || tc.name;
      const rawArgs = tc.function?.arguments ?? tc.arguments ?? {};
      const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
      const impl = TOOLS[name];
      let result;
      try {
        result = impl
          ? impl(args, callId)
          : `Unknown tool ${name} — take the caller's info as a message instead.`;
      } catch (err) {
        console.error(`Tool ${name} failed:`, err);
        result = 'Something went wrong on our end — take the caller\'s name and number as a message instead.';
      }
      return { toolCallId: tc.id, result };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ results }));
  }

  // End-of-call report: summary + transcript + analysis. This feeds the
  // daily/weekly summary email that keeps clients subscribed.
  if (message.type === 'end-of-call-report') {
    appendRecord('calls', {
      callId,
      endedReason: message.endedReason,
      durationSeconds: message.durationSeconds,
      summary: message.analysis?.summary,
      successEvaluation: message.analysis?.successEvaluation,
      transcript: message.transcript,
    });
    console.log('CALL ENDED:', message.analysis?.summary || '(no summary)');
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{}');
});

server.listen(PORT, () => {
  console.log(`Voice agent webhook listening on :${PORT}`);
  console.log(`Tool calls  -> POST /vapi/tools`);
  console.log(`Call events -> POST /vapi/events`);
  console.log(`Data dir    -> ${DATA_DIR}`);
});
