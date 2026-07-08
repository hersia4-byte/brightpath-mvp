# Remote Onboarding — Signed to Live Without Leaving Your Desk

Every step of client setup is done online. The only thing the client ever
touches is their own phone, to enable call forwarding — and you're on a call
with them when they do it. Target timeline: **signed → live in 3 business days.**

## Day 0 — Close (video or phone call)

- [ ] Prospect has called the demo agent (that's what closed them)
- [ ] Send the service agreement via e-signature — DocuSign, PandaDoc, or
      Dropbox Sign (free tiers are fine at this volume). Signed from their phone.
- [ ] Send a Stripe payment link / subscription — card on file, bills monthly
      automatically. Never invoice manually; trial billing starts day 15 on its own.
- [ ] Book two calls before hanging up: the **intake call** (within 2 days) and
      the **go-live call** (day after intake). Unbooked onboarding stalls.

## Day 1 — Intake call (15 min, screen share)

- [ ] Pre-fill `forms/intake-form.html` from their website BEFORE the call —
      the call is confirmation, not homework for them
- [ ] Share your screen, walk the form, type their answers live
- [ ] Ask the vertical pack's extra questions (`verticals/<niche>.md`)
- [ ] Confirm the recording-notice wording in the greeting (two-party-consent
      states: CA, FL, IL, PA, WA among others)
- [ ] Look up their phone carrier or VoIP system NOW — you need the exact
      forwarding codes for the go-live call
- [ ] Send them the completed form as PDF for their records

## Day 2 — Build (no client involvement)

- [ ] Render the system prompt with their intake answers + vertical block
- [ ] Set their hours/slots in `server/config.json`; deploy their webhook
- [ ] Create their assistant (`vapi/create-assistant.sh`), buy their number
- [ ] Run the six-scenario acceptance test yourself (see
      `docs/INTEGRATIONS.md` §2) — fix wording until all six feel right
- [ ] Record a 3-minute Loom of THEIR agent working: their greeting, a test
      booking landing in their inbox. Send it with "we're ready for tomorrow."
      This video replaces the reassurance of an in-person visit.

## Day 3 — Go-live call (10 min, they dial one code)

- [ ] Confirm notifications: their cell for summaries, email for bookings
- [ ] Enable forwarding — read them the exact digits for their carrier:
      - **All calls:** `*72` + agent number (most US carriers); `**21*<number>#`
        on some GSM carriers
      - **No-answer / busy only** (the low-risk option most clients start with):
        carrier-specific — commonly `*71`, `*92`, or `*004*<number>#` — verify
        for their carrier the day before
      - **VoIP / office systems** (RingCentral, Grasshopper, Google Voice,
        phone trees): it's a setting in their admin app — screen share and
        click it together
- [ ] **Test live together:** they call their own business line from a cell,
      hear the agent, book a test appointment, watch the confirmation arrive
- [ ] Show them how to disable forwarding (`*73` on most carriers) so they
      never feel trapped — paradoxically, this increases retention
- [ ] Tell them week one expectations: you're reading every transcript daily
      and they should forward any concern the moment they feel it

## Days 4–14 — Tuning (all remote)

- [ ] Skim every transcript daily in the dashboard; tighten the prompt
- [ ] Day 7: send the first weekly summary (calls answered, bookings, messages)
      even though it's mid-trial — it's the invoice justification habit
- [ ] Day 13: quick check-in call — "trial converts tomorrow, here's what it
      booked for you" — convert or address concerns before billing starts

## When in-person is worth it anyway

Never technically. As a sales tactic only: walking into your first 2–3 local
prospects closes deals a cold email won't, and a photo with a happy local
owner is marketing material. Operationally, remote is what lets you serve a
client three states away identically to one down the street.
