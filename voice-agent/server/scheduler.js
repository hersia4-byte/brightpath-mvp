// Booking engine: resolves spoken days/times to concrete dates, checks
// availability against the client's configured hours and existing bookings,
// and books slots with double-booking protection.
//
// This is a self-contained scheduler good enough for demos and small clients.
// For production clients who live in Google Calendar or a CRM, swap the
// findOpenSlots/book internals for API calls (see docs/INTEGRATIONS.md) —
// the tool interface stays identical.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(fs.readFileSync(path.join(DIR, 'config.json'), 'utf8'));
const DATA_DIR = path.join(DIR, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function loadBookings() {
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveBookings(bookings) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// "tomorrow", "Thursday", "next Friday", "July 16" → a concrete Date (or null).
export function resolveDay(spoken, from = new Date()) {
  if (!spoken) return null;
  const s = spoken.trim().toLowerCase();
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  if (s === 'today') return base;
  if (s === 'tomorrow') return addDays(base, 1);

  const dayIdx = DAY_NAMES.findIndex((d) => s.includes(d.toLowerCase()));
  if (dayIdx !== -1) {
    let delta = (dayIdx - base.getDay() + 7) % 7;
    if (delta === 0) delta = 7; // "Thursday" said on a Thursday means next week
    if (s.startsWith('next ') && delta <= 3) delta += 7;
    return addDays(base, delta);
  }

  // Only attempt calendar-date parsing on strings shaped like dates —
  // JS Date parsing is lenient enough to turn arbitrary phrases into dates.
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
  const looksLikeDate =
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(st|nd|rd|th)?$/.test(s) ||
    /^\d{1,2}[/-]\d{1,2}$/.test(s);
  if (looksLikeDate) {
    const parsed = new Date(`${s.replace(/(st|nd|rd|th)$/, '')} ${from.getFullYear()}`);
    if (!Number.isNaN(parsed.getTime())) {
      const d = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      return d < base ? new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()) : d;
    }
  }
  return null;
}

// "10am", "10:30 AM", "2 pm", "14:00" → "HH:MM" 24h (or null).
export function normalizeTime(spoken) {
  if (!spoken) return null;
  const m = String(spoken).trim().toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] || '00';
  const mer = m[3] ? m[3][0] : null;
  if (mer === 'p' && h < 12) h += 12;
  if (mer === 'a' && h === 12) h = 0;
  if (!mer && h <= 7) h += 12; // "at 2" on a business phone means 2pm
  if (h > 23 || parseInt(min, 10) > 59) return null;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function speakTime(hhmm) {
  let [h, m] = hhmm.split(':').map(Number);
  const mer = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, '0')} ${mer}` : `${h} ${mer}`;
}

function speakDate(d) {
  return `${DAY_NAMES[d.getDay()]}, ${d.toLocaleString('en-US', { month: 'long' })} ${d.getDate()}`;
}

export function openSlotsForDate(date, bookings = loadBookings()) {
  const configured = CONFIG.hours[DAY_KEYS[date.getDay()]] || [];
  const dayBookings = bookings[isoDate(date)] || {};
  return configured.filter((t) => !dayBookings[t]);
}

// Tool: checkAvailability — the agent calls this BEFORE offering times.
export function checkAvailability({ day }, now = new Date()) {
  const date = resolveDay(day, now);
  if (!date) {
    return { available: false, speech: `I couldn't pin down which day "${day}" is — ask the caller to say a weekday or a date.` };
  }
  const daysAhead = Math.round((date - now) / 86400000);
  if (daysAhead > (CONFIG.maxDaysAhead || 30)) {
    return { available: false, speech: `That's too far out — we book up to ${CONFIG.maxDaysAhead} days ahead. Offer a sooner day.` };
  }
  const open = openSlotsForDate(date);
  if (open.length === 0) {
    // Look ahead for the next day with openings so the agent can offer it.
    for (let i = 1; i <= 7; i++) {
      const alt = addDays(date, i);
      const altOpen = openSlotsForDate(alt);
      if (altOpen.length) {
        return {
          available: false, date: isoDate(date),
          speech: `Nothing open on ${speakDate(date)}. The next opening is ${speakDate(alt)} at ${speakTime(altOpen[0])} — offer that instead.`,
        };
      }
    }
    return { available: false, date: isoDate(date), speech: `Nothing open on ${speakDate(date)} or the following week. Take a message so the team can follow up.` };
  }
  const spoken = open.slice(0, 3).map(speakTime).join(', ');
  return {
    available: true, date: isoDate(date), openSlots: open,
    speech: `On ${speakDate(date)} we have ${spoken}${open.length > 3 ? ', and more' : ''} open. Offer these to the caller.`,
  };
}

// Tool: bookAppointment — validates the slot is still free, then books it.
export function bookAppointment(args, now = new Date()) {
  const { callerName, phone, appointmentType, day, time } = args;
  const date = resolveDay(day, now);
  const slot = normalizeTime(time);
  if (!date || !slot) {
    return { booked: false, speech: `I couldn't understand ${!date ? `the day "${day}"` : `the time "${time}"`} — confirm it with the caller and try again.` };
  }

  const dateKey = isoDate(date);
  const bookings = loadBookings();
  const configured = CONFIG.hours[DAY_KEYS[date.getDay()]] || [];

  if (!configured.includes(slot)) {
    const open = openSlotsForDate(date, bookings);
    return {
      booked: false,
      speech: open.length
        ? `${speakTime(slot)} isn't a slot we offer on ${speakDate(date)}. Open times are ${open.slice(0, 3).map(speakTime).join(', ')} — offer those.`
        : `${speakDate(date)} has no availability. Check another day for the caller.`,
    };
  }
  if (bookings[dateKey]?.[slot]) {
    const open = openSlotsForDate(date, bookings);
    return {
      booked: false,
      speech: open.length
        ? `${speakTime(slot)} on ${speakDate(date)} was just taken. Still open: ${open.slice(0, 3).map(speakTime).join(', ')} — offer those.`
        : `${speakDate(date)} just filled up. Check another day for the caller.`,
    };
  }

  const confirmationId = `APT-${dateKey.replaceAll('-', '')}-${slot.replace(':', '')}`;
  bookings[dateKey] = bookings[dateKey] || {};
  bookings[dateKey][slot] = {
    confirmationId, callerName, phone, appointmentType,
    details: args.details || '', notes: args.notes || '',
    bookedAt: new Date().toISOString(),
  };
  saveBookings(bookings);

  return {
    booked: true, confirmationId, date: dateKey, time: slot,
    speech: `Booked: ${appointmentType || 'appointment'} for ${callerName} on ${speakDate(date)} at ${speakTime(slot)}. Confirm the details back and tell the caller they'll get a confirmation shortly.`,
  };
}
