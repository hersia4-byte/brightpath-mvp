// Automated tests for the booking engine and webhook — simulates the exact
// tool-call sequences a live call produces.
//
//   node test.js
//
// Covers: day/time parsing, availability lookup, booking, double-booking
// rejection with alternatives, off-hours rejection, unknown-input handling,
// and a full HTTP round trip in Vapi's wire format.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { resolveDay, normalizeTime, checkAvailability, bookAppointment } from './scheduler.js';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(DIR, 'data');

// Fresh state: tests run against a clean bookings file.
fs.rmSync(DATA_DIR, { recursive: true, force: true });

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

// A fixed "now" for deterministic date math: Wednesday.
const NOW = new Date('2026-07-08T09:00:00'); // Wednesday, July 8 2026

console.log('\nParsing');
test('resolveDay: weekday name → next occurrence', () => {
  assert.equal(resolveDay('Thursday', NOW).getDay(), 4);
  assert.equal(resolveDay('thursday', NOW).getDate(), 9); // tomorrow
});
test('resolveDay: same weekday said today → next week', () => {
  assert.equal(resolveDay('Wednesday', NOW).getDate(), 15);
});
test('resolveDay: tomorrow / today / explicit date', () => {
  assert.equal(resolveDay('tomorrow', NOW).getDate(), 9);
  assert.equal(resolveDay('today', NOW).getDate(), 8);
  assert.equal(resolveDay('July 16', NOW).getDate(), 16);
});
test('resolveDay: gibberish → null', () => {
  assert.equal(resolveDay('whenever vibes align', NOW), null);
});
test('normalizeTime: spoken variants', () => {
  assert.equal(normalizeTime('10am'), '10:00');
  assert.equal(normalizeTime('10:30 AM'), '10:30');
  assert.equal(normalizeTime('2 pm'), '14:00');
  assert.equal(normalizeTime('2'), '14:00'); // bare small number → afternoon
  assert.equal(normalizeTime('14:00'), '14:00');
  assert.equal(normalizeTime('noon-ish?'), null);
});

console.log('\nAvailability');
test('open weekday lists slots', () => {
  const r = checkAvailability({ day: 'Thursday' }, NOW);
  assert.equal(r.available, true);
  assert.ok(r.openSlots.includes('10:00'));
  assert.match(r.speech, /10 AM/);
});
test('closed day (Sunday) offers next opening', () => {
  const r = checkAvailability({ day: 'Sunday' }, NOW);
  assert.equal(r.available, false);
  assert.match(r.speech, /next opening is Monday/);
});
test('unparseable day asks to clarify', () => {
  const r = checkAvailability({ day: 'the day after the game' }, NOW);
  assert.equal(r.available, false);
  assert.match(r.speech, /couldn't pin down/);
});
test('too far ahead is declined', () => {
  const r = checkAvailability({ day: 'December 25' }, NOW);
  assert.equal(r.available, false);
  assert.match(r.speech, /too far out/);
});

console.log('\nBooking');
test('books an open slot with confirmation id', () => {
  const r = bookAppointment({
    callerName: 'Maria Lopez', phone: '555-0142',
    appointmentType: 'facility tour', day: 'Thursday', time: '10am',
    details: 'child is 2 years old',
  }, NOW);
  assert.equal(r.booked, true);
  assert.equal(r.time, '10:00');
  assert.match(r.confirmationId, /^APT-\d{8}-1000$/);
});
test('booking is persisted to disk', () => {
  const bookings = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bookings.json'), 'utf8'));
  const day = Object.keys(bookings)[0];
  assert.equal(bookings[day]['10:00'].callerName, 'Maria Lopez');
});
test('double-booking the same slot is rejected with alternatives', () => {
  const r = bookAppointment({
    callerName: 'Dan Reyes', phone: '555-0177',
    appointmentType: 'estimate', day: 'Thursday', time: '10:00 AM',
  }, NOW);
  assert.equal(r.booked, false);
  assert.match(r.speech, /just taken/);
  assert.match(r.speech, /9 AM|11 AM/);
});
test('booked slot no longer shows as available', () => {
  const r = checkAvailability({ day: 'Thursday' }, NOW);
  assert.ok(!r.openSlots.includes('10:00'));
});
test('off-hours time is rejected with real options', () => {
  const r = bookAppointment({
    callerName: 'Ana', phone: '555-1', appointmentType: 'tour',
    day: 'Thursday', time: '7am',
  }, NOW);
  assert.equal(r.booked, false);
  assert.match(r.speech, /isn't a slot we offer/);
});
test('unparseable time asks to confirm', () => {
  const r = bookAppointment({
    callerName: 'Ana', phone: '555-1', appointmentType: 'tour',
    day: 'Thursday', time: 'early-ish',
  }, NOW);
  assert.equal(r.booked, false);
  assert.match(r.speech, /couldn't understand the time/);
});

console.log('\nHTTP round trip (Vapi wire format)');
const PORT = 3179;
const child = spawn(process.execPath, [path.join(DIR, 'webhook.js')], {
  env: { ...process.env, PORT }, stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 700));

async function callTool(name, args) {
  const res = await fetch(`http://localhost:${PORT}/vapi/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        type: 'tool-calls', call: { id: 'test-http' },
        toolCallList: [{ id: 'tc1', function: { name, arguments: JSON.stringify(args) } }],
      },
    }),
  });
  return (await res.json()).results[0].result;
}

try {
  // Full realistic call: caller wants Friday 3pm (closed slot on Fridays),
  // agent checks, offers alternatives, books an open one.
  const avail = await callTool('checkAvailability', { day: 'Friday' });
  assert.match(avail, /we have 9 AM/);
  console.log('  ✓ checkAvailability over HTTP');

  const denied = await callTool('bookAppointment', {
    callerName: 'Priya N', phone: '555-0199', appointmentType: 'consultation',
    day: 'Friday', time: '3pm',
  });
  assert.match(denied, /isn't a slot we offer on Friday/);
  console.log('  ✓ off-hours booking rejected over HTTP');

  const booked = await callTool('bookAppointment', {
    callerName: 'Priya N', phone: '555-0199', appointmentType: 'consultation',
    day: 'Friday', time: '2pm',
  });
  assert.match(booked, /Booked: consultation for Priya N on Friday/);
  console.log('  ✓ booking confirmed over HTTP');

  const msg = await callTool('takeMessage', {
    callerName: 'J. Smith', phone: '555-3', category: 'callback',
    message: 'Wants to discuss pricing for two locations',
  });
  assert.match(msg, /Message recorded/);
  console.log('  ✓ takeMessage over HTTP');
  passed += 4;
} finally {
  child.kill();
}

console.log(`\nAll ${passed} tests passed.\n`);
