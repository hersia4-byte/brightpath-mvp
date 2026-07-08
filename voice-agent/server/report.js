// Review dashboard: renders everything the agent saved into one clean HTML
// page — bookings, messages, and per-call summaries with pass/fail triage.
//
//   node report.js > report.html     # standalone
//   GET /report on the webhook      # live view, same output
//
// This is the page you skim each morning during a client's first two weeks,
// and the body of the weekly summary email that keeps clients subscribed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(DIR, 'data');

function readJsonl(name) {
  try {
    return fs.readFileSync(path.join(DATA_DIR, name), 'utf8')
      .trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

function readBookings() {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bookings.json'), 'utf8'));
  } catch {
    return {};
  }
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderReport(businessName = 'Your Business') {
  const bookings = readBookings();
  const messages = readJsonl('messages.jsonl');
  const calls = readJsonl('calls.jsonl');

  const bookingRows = Object.entries(bookings).flatMap(([date, slots]) =>
    Object.entries(slots).map(([time, b]) => ({ date, time, ...b })))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const failed = calls.filter((c) => /fail/i.test(c.successEvaluation || ''));

  const stat = (n, label) =>
    `<div class="stat"><b>${n}</b><span>${esc(label)}</span></div>`;

  const bookingsHtml = bookingRows.length
    ? `<table><tr><th>Date</th><th>Time</th><th>Type</th><th>Name</th><th>Phone</th><th>Details</th><th>Confirmation</th></tr>${
      bookingRows.map((b) => `<tr><td>${esc(b.date)}</td><td>${esc(b.time)}</td><td>${esc(b.appointmentType)}</td><td>${esc(b.callerName)}</td><td>${esc(b.phone)}</td><td>${esc(b.details)}</td><td class="mono">${esc(b.confirmationId)}</td></tr>`).join('')
    }</table>`
    : '<p class="empty">No appointments booked yet.</p>';

  const messagesHtml = messages.length
    ? `<table><tr><th>When</th><th>Category</th><th>From</th><th>Phone</th><th>Message</th></tr>${
      messages.map((m) => `<tr><td>${esc((m.receivedAt || '').slice(0, 16).replace('T', ' '))}</td><td><span class="tag">${esc(m.category)}</span></td><td>${esc(m.callerName)}</td><td>${esc(m.phone)}</td><td>${esc(m.message)}</td></tr>`).join('')
    }</table>`
    : '<p class="empty">No messages taken yet.</p>';

  const callsHtml = calls.length
    ? calls.map((c) => `
      <div class="call ${/fail/i.test(c.successEvaluation || '') ? 'fail' : ''}">
        <div class="call-head">
          <span class="badge ${/fail/i.test(c.successEvaluation || '') ? 'bad' : 'good'}">${/fail/i.test(c.successEvaluation || '') ? 'REVIEW' : 'OK'}</span>
          <b>${esc((c.receivedAt || '').slice(0, 16).replace('T', ' '))}</b>
          <span class="muted">${c.durationSeconds ? Math.round(c.durationSeconds / 60 * 10) / 10 + ' min' : ''}</span>
        </div>
        <p>${esc(c.summary || '(no summary)')}</p>
        ${c.transcript ? `<details><summary>Transcript</summary><pre>${esc(c.transcript)}</pre></details>` : ''}
      </div>`).join('')
    : '<p class="empty">No completed calls yet.</p>';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Call Activity — ${esc(businessName)}</title>
<style>
  :root { --ink:#1f2937; --muted:#6b7280; --brand:#155e75; --line:#e5e7eb; --soft:#f0f9fa; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
         color:var(--ink); background:#f8fafc; line-height:1.5; }
  .wrap { max-width:860px; margin:0 auto; padding:32px 20px 60px; }
  h1 { font-size:22px; } .sub { color:var(--muted); margin-bottom:24px; }
  h2 { font-size:15px; text-transform:uppercase; letter-spacing:.1em; color:var(--brand);
       margin:32px 0 12px; }
  .stats { display:flex; gap:14px; flex-wrap:wrap; }
  .stat { flex:1 1 130px; background:#fff; border:1px solid var(--line); border-radius:12px;
          padding:16px 18px; }
  .stat b { display:block; font-size:26px; color:var(--brand); }
  .stat span { font-size:13px; color:var(--muted); }
  .table-scroll { overflow-x:auto; background:#fff; border:1px solid var(--line); border-radius:12px; }
  table { width:100%; border-collapse:collapse; font-size:13.5px; min-width:560px; }
  th, td { padding:9px 12px; text-align:left; border-bottom:1px solid var(--line); }
  th { background:var(--soft); font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
  tr:last-child td { border-bottom:none; }
  .mono { font-family:ui-monospace,Menlo,monospace; font-size:12px; }
  .tag { background:var(--soft); color:var(--brand); border-radius:999px; padding:2px 10px;
         font-size:12px; font-weight:600; }
  .call { background:#fff; border:1px solid var(--line); border-radius:12px;
          padding:14px 18px; margin-bottom:12px; }
  .call.fail { border-color:#f59e0b; background:#fffbeb; }
  .call-head { display:flex; gap:12px; align-items:center; margin-bottom:6px; }
  .badge { font-size:11px; font-weight:700; border-radius:6px; padding:2px 8px; }
  .badge.good { background:#ecfdf5; color:#047857; }
  .badge.bad { background:#fef3c7; color:#b45309; }
  .muted { color:var(--muted); font-size:13px; }
  details { margin-top:8px; } summary { cursor:pointer; color:var(--brand); font-size:13px; }
  pre { white-space:pre-wrap; background:var(--soft); border-radius:8px; padding:12px;
        font-size:12.5px; margin-top:8px; }
  .empty { color:var(--muted); font-style:italic; background:#fff; border:1px dashed var(--line);
           border-radius:12px; padding:18px; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#e5e7eb; --muted:#9ca3af; --line:#374151; --soft:#0b2530; }
    body { background:#0f172a; }
    .stat,.table-scroll,.call,.empty { background:#1f2937; }
    .call.fail { background:#2a2410; }
    .badge.good { background:#064e3b; color:#6ee7b7; }
    .badge.bad { background:#453a16; color:#fcd34d; }
  }
</style></head><body><div class="wrap">
  <h1>Call Activity — ${esc(businessName)}</h1>
  <p class="sub">Everything your receptionist handled, saved for your review.</p>
  <div class="stats">
    ${stat(calls.length, 'calls completed')}
    ${stat(bookingRows.length, 'appointments booked')}
    ${stat(messages.length, 'messages taken')}
    ${stat(failed.length, 'flagged for review')}
  </div>
  <h2>Appointments</h2><div class="table-scroll">${bookingsHtml}</div>
  <h2>Messages</h2><div class="table-scroll">${messagesHtml}</div>
  <h2>Calls</h2>${callsHtml}
</div></body></html>`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(renderReport(process.env.BUSINESS_NAME || 'Demo Business'));
}
