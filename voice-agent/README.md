# BrightPath Voice — AI Receptionist for Childcare Centers

A complete, sell-ready package for launching an AI voice agent business targeting
childcare/daycare centers. Everything here is built to go from zero to a paying
client without buying a course.

## The product

An AI phone receptionist ("Sunny") that answers a childcare center's phone 24/7:

- Answers enrollment and tuition questions instantly
- Books facility tours directly onto the director's calendar
- Takes structured messages (absence reports, late pickup, general)
- Escalates emergencies to a human immediately
- Never misses a call during pickup/drop-off chaos

**Why childcare:** one enrollment is worth $10,000–$20,000/year to a center.
If the agent converts even one missed call per quarter into a tour, it pays for
itself many times over. That's the whole sales pitch.

## What's in this package

| Path | What it is |
|---|---|
| `PLAYBOOK.md` | Offer, pricing, cost/margin math, outreach scripts, demo flow, objection handling |
| `prompts/system-prompt.md` | Production system prompt with `{{variables}}` for per-client customization |
| `onboarding/client-intake-form.md` | Questions to ask each client to fill those variables |
| `vapi/assistant.json` | Vapi assistant config, ready to create via API |
| `vapi/create-assistant.sh` | One-command script to create the assistant from the JSON |
| `server/webhook.js` | Zero-dependency Node server that handles tool calls (tour booking, messages) |
| `demo/index.html` | Self-contained sales one-pager to send to or show prospects |

## Launch checklist (one weekend)

1. **Sign up for [Vapi](https://vapi.ai)** (~$0.05/min platform fee, pay-as-you-go).
   Alternatives: Retell AI, Bland — same concepts, different config format.
2. **Verify the schema.** The config in `vapi/assistant.json` follows Vapi's
   CreateAssistantDTO as of early 2026. Diff it against the current
   [API reference](https://docs.vapi.ai/api-reference/assistants/create) before
   creating — field names occasionally change.
3. **Deploy the webhook.** `node server/webhook.js` locally, then put it on any
   host with a public URL (Railway, Render, Fly, a $5 VPS). Set the URL in
   `assistant.json` (`server.url` and each tool's `server.url`).
4. **Create the assistant:** `VAPI_API_KEY=... ./vapi/create-assistant.sh`
5. **Buy a phone number** in the Vapi dashboard (~$2/mo) and attach the assistant.
6. **Call it.** Test every path: tuition question, tour booking, absence message,
   emergency escalation, and something off-script. Fix the prompt until all five
   feel right.
7. **Record your demo call** — this recording is your #1 sales asset.
8. **Start outreach** using `PLAYBOOK.md`. Ten centers within 15 miles of you is
   the first list.

## Per-client setup (under 2 hours once practiced)

1. Client fills out `onboarding/client-intake-form.md` (15-min call, you type).
2. Substitute the answers into the `{{variables}}` in the system prompt.
3. Create a new assistant + phone number for them (each client gets their own).
4. Client forwards their line to it — either fully after-hours, or on no-answer
   after 4 rings during the day (the low-risk pitch that closes deals).
5. Test-call together, tweak wording live, done.

## Costs at a glance (per client, per month)

~300 calls/mo × ~2.5 min ≈ 750 min → roughly **$75–$115/mo** all-in
(platform + LLM + voice + transcription + telephony). At $397/mo you keep
~$290; at $597/mo you keep ~$490. Full math in `PLAYBOOK.md`.
