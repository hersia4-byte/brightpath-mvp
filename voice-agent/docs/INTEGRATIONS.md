# How It Works: Voice, Testing, and Service Connections

## 1. How the voice actually works

A live call flows through four pieces, all orchestrated by Vapi:

```
caller speaks          agent replies
     │                       ▲
     ▼                       │
┌───────────┐   text   ┌───────────┐   text   ┌───────────┐
│ Transcriber│ ───────▶ │    LLM    │ ───────▶ │   Voice   │
│ (Deepgram) │          │ (GPT-4o)  │          │ (11labs)  │
└───────────┘          └─────┬─────┘          └───────────┘
                             │ tool calls (JSON over HTTPS)
                             ▼
                    ┌─────────────────┐
                    │ YOUR webhook     │  server/webhook.js
                    │ checkAvailability│  → reads config.json + bookings
                    │ bookAppointment  │  → writes booking, returns speech
                    │ takeMessage      │  → logs message, notifies owner
                    └─────────────────┘
```

- **Transcriber** turns the caller's speech into text in ~200ms (Deepgram
  nova-3 in our config).
- **LLM** reads the system prompt + conversation and decides what to say or
  which tool to call (gpt-4o in our config).
- **Voice** turns the reply into speech. This is where "professional" lives:
  the ElevenLabs voice in `assistant.json` (`voice.voiceId`) sets the entire
  personality. Audition voices in the Vapi dashboard → Voice tab; pick one per
  vertical (warm for childcare, crisp for dental, energetic for home services)
  and keep it consistent.
- **Your webhook** is the only part you own. When the LLM calls a tool, Vapi
  POSTs to your server and speaks whatever `result` string you return. That
  string is an *instruction to the agent* ("Offer these times…"), not words
  read verbatim — the LLM rephrases it naturally.

The agent never invents appointment times: the prompt forbids offering a time
before `checkAvailability` returns real open slots, and `bookAppointment`
re-validates at write time, so even two simultaneous callers can't take the
same slot (the loser gets alternatives to offer).

## 2. How to test it

**Tier 1 — logic tests (free, runs anywhere, already passing):**

```
cd server && node test.js
```

19 tests simulate the exact tool-call sequences a live call produces: spoken
day/time parsing ("tomorrow", "2 pm", "July 16"), availability lookup, booking
with confirmation IDs, double-booking rejection with alternatives, off-hours
rejection, and a full HTTP round trip in Vapi's wire format. Run this after
every prompt or config change.

**Tier 2 — talk to it in the browser (free, no phone number needed):**
In the Vapi dashboard, open your assistant and click **Talk to Assistant** —
a web call using your mic. This is where you iterate on wording, voice choice,
and interruption behavior. Do this before spending anything on telephony.

**Tier 3 — real phone call (~$2/mo for the number):**
Buy a number in the dashboard, attach the assistant, and call it from your
cell. Phone audio behaves differently (compression, background noise, people
talking over the agent) — always do a real-call pass before a client demo.

**The six-scenario acceptance script (run on every new client's agent):**
1. Pricing question the prompt covers → answered from approved info only
2. "Can I come in Thursday?" → agent CHECKS availability before offering times
3. Book a slot, then call back and try to book the same slot → rejected, alternatives offered
4. Question the prompt does NOT cover → takes a message, doesn't guess
5. Emergency phrase from the vertical pack → immediate transfer, no data collection
6. "Are you a robot?" → discloses it's an AI, keeps helping

Then review the call in the dashboard: read the transcript, listen to the
recording, check the end-of-call summary landed in `server/data/calls.jsonl`.

## 3. Connecting real services

The webhook returns speech first, then does the plumbing. Everything below
hangs off the `TODO` markers in `server/webhook.js`.

**Where appointments are documented today (no integration needed):**
Every booking is written to `server/data/bookings.json` keyed by date and time
with a confirmation ID (`APT-20260716-1000`), caller name, phone, type,
details, and timestamp. Availability checks and messages log to
`data/*.jsonl`. This is already enough for a weekly client summary.

**Google Calendar (what most clients want):**
Create a Google Cloud service account, share the client's calendar with it,
then in `bookAppointment` after a successful booking:

```js
// npm i googleapis
import { google } from 'googleapis';
const auth = new google.auth.GoogleAuth({ keyFile: 'service-account.json',
  scopes: ['https://www.googleapis.com/auth/calendar'] });
const cal = google.calendar({ version: 'v3', auth });
await cal.events.insert({ calendarId: CLIENT_CALENDAR_ID, requestBody: {
  summary: `${args.appointmentType} — ${args.callerName} (${result.confirmationId})`,
  description: `Phone: ${args.phone}\n${args.details || ''}`,
  start: { dateTime: `${result.date}T${result.time}:00`, timeZone: config.timezone },
  end:   { dateTime: endTime, timeZone: config.timezone },
}});
```

For two-way sync (center staff also book manually), read free/busy from the
calendar inside `checkAvailability` instead of `bookings.json`.

**Cal.com (easiest path to "professional" fast):**
Free tier, handles reschedules/reminders/timezones for you. Replace the
scheduler internals with two REST calls: `GET /v2/slots` in `checkAvailability`
and `POST /v2/bookings` in `bookAppointment`. Client gets a real booking system
with email confirmations on day one.

**SMS notifications (Twilio — the "wow" in every demo):**
```js
// npm i twilio
await twilio.messages.create({ to: OWNER_CELL, from: TWILIO_NUMBER,
  body: `📅 New ${args.appointmentType}: ${args.callerName}, ${result.date} ${result.time}. ${args.phone}` });
await twilio.messages.create({ to: args.phone, from: TWILIO_NUMBER,
  body: `You're confirmed for ${result.date} at ${result.time} — ${businessName}. Ref ${result.confirmationId}` });
```
The caller getting a confirmation text 10 seconds after hanging up is the
single most convincing moment in any demo.

**Email summaries (the retention engine):**
A nightly cron reads `data/calls.jsonl` + `bookings.json` and emails the owner:
calls answered, appointments booked, messages taken, anything flagged. Use
Resend or Postmark (~3 lines of code each).

**CRM (when a client asks):** push `bookAppointment`/`takeMessage` payloads to
HubSpot/GoHighLevel/ServiceTitan via their REST APIs at the same TODO points —
the JSON already has every field they need.

**No-code alternative:** point the TODO at a Zapier/Make webhook URL and let
the client's own Zaps route bookings to calendar + SMS + CRM. Slightly higher
latency, zero code, and clients can self-serve changes.

## 4. Operational notes for "professional"

- **One assistant + one webhook deployment per client.** Never share state.
- Put the webhook behind HTTPS with a stable domain; Vapi retries failed
  webhooks but flaky infra becomes "the AI hung up on someone."
- Keep `config.json` per client under version control — hours changes are the
  #1 recurring support request.
- Log everything (this package already does); when a client asks "what did it
  say to Mrs. Garcia?", you answer in 30 seconds with the transcript.
- Update `CURRENT_OPENINGS`-type prompt facts monthly — stale info is how you
  lose accounts.
