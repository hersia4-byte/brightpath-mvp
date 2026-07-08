// Zero-dependency webhook server for the Vapi assistant.
// Handles tool calls (bookAppointment, takeMessage) and end-of-call reports.
//
//   node webhook.js            # listens on :3100
//   PORT=8080 node webhook.js
//
// Data lands in ./data/ as JSON lines — one file per type. Wire up real
// notifications where marked TODO (email/SMS is what clients actually want).
//
// Deploy anywhere with a public HTTPS URL (Railway, Render, Fly, a VPS behind
// Caddy), then set that URL in assistant.json (server.url and each tool's
// server.url), e.g. https://your-host/vapi/tools and /vapi/events.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3100;
const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

function appendRecord(kind, record) {
  const line = JSON.stringify({ receivedAt: new Date().toISOString(), ...record }) + '\n';
  fs.appendFileSync(path.join(DATA_DIR, `${kind}.jsonl`), line);
}

// --- Tool implementations -------------------------------------------------

function bookAppointment(args, callId) {
  appendRecord('appointments', { callId, ...args });
  // TODO: create a calendar event (Google Calendar API / Cal.com) and
  // TODO: text the owner (Twilio) — this is the "wow" clients pay for.
  console.log('APPOINTMENT BOOKED:', args);
  return `${args.appointmentType || 'Appointment'} request recorded for ${args.callerName} at ${args.preferredTime}. Tell the caller they'll get a confirmation shortly.`;
}

function takeMessage(args, callId) {
  appendRecord('messages', { callId, ...args });
  // TODO: forward to the client's email; SMS the owner for urgent categories.
  console.log(`MESSAGE [${args.category}]:`, args);
  return 'Message recorded. Tell the caller the team will follow up promptly.';
}

const TOOLS = { bookAppointment, takeMessage };

// --- HTTP plumbing ---------------------------------------------------------

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
    return res.end('BrightPath Voice webhook is up.\n');
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
      const result = impl
        ? impl(args, callId)
        : `Unknown tool ${name} — take the caller's info as a message instead.`;
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
  console.log(`BrightPath Voice webhook listening on :${PORT}`);
  console.log(`Tool calls  -> POST /vapi/tools`);
  console.log(`Call events -> POST /vapi/events`);
  console.log(`Data dir    -> ${DATA_DIR}`);
});
