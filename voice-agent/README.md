# Voice Agent — AI Phone Receptionist (Any Local Business)

A complete, sell-ready package for launching an AI voice agent business. The
core is **industry-agnostic**; each niche is a plug-in "vertical pack." When a
customer from a new industry asks, you customize by filling in one file — the
prompt, tools, webhook, playbook, and demo page all stay the same.

## The product

An AI phone receptionist that answers a business's phone 24/7:

- Answers customer questions using only information the client approves
- Books appointments (tours, estimates, showings, consults) onto their calendar
- Takes structured messages and texts the owner a summary
- Escalates emergencies to a human immediately
- Never misses a call at their busiest hour

## How customization works

```
core (never changes per client)          per-client (fill these in)
─────────────────────────────────        ──────────────────────────────
prompts/system-prompt.md  ─┐             1. pick verticals/<niche>.md
vapi/assistant.json        ├─ generic       (or copy _template.md for a
server/webhook.js          │                 new industry, ~30 min)
demo/index.html (presets) ─┘             2. fill onboarding/client-intake-form.md
PLAYBOOK.md                                 (15-min call with the client)
                                         3. substitute {{variables}} → create
                                            assistant → forward their line
```

## What's in this package

| Path | What it is |
|---|---|
| `PLAYBOOK.md` | Industry-agnostic sales playbook: offer formula, pricing, unit economics, outreach, objections |
| `verticals/` | Niche packs: childcare, real-estate/property, dental/medical, home-services + `_template.md` for new industries |
| `prompts/system-prompt.md` | Generic system prompt with `{{variables}}` + a `{{VERTICAL_KNOWLEDGE_BLOCK}}` slot |
| `onboarding/client-intake-form.md` | Core intake questions; vertical packs add their own |
| `vapi/assistant.json` | Vapi assistant config with generic `bookAppointment` / `takeMessage` / `transferCall` tools |
| `vapi/create-assistant.sh` | One-command create/update script |
| `server/webhook.js` | Zero-dependency Node server handling tool calls and call reports |
| `demo/index.html` | One sales page, all verticals — switch copy with `?vertical=childcare\|realestate\|dental\|homeservices` |

## Launch checklist (one weekend)

1. **Pick your first vertical** — read the packs in `verticals/` and choose the
   one where you have contacts or credibility. Master one before opening a second.
2. **Sign up for [Vapi](https://vapi.ai)** (~$0.05/min platform fee, pay-as-you-go).
   Alternatives: Retell AI, Bland — same concepts, different config format.
3. **Verify the schema.** `vapi/assistant.json` follows Vapi's CreateAssistantDTO
   as of early 2026 — diff against the current
   [API reference](https://docs.vapi.ai/api-reference/assistants/create) first.
4. **Deploy the webhook.** `node server/webhook.js` locally, then any host with
   a public URL (Railway, Render, Fly). Set the URL in `assistant.json`.
5. **Create a demo assistant** for a fictional business in your vertical:
   render the prompt with made-up intake answers, then
   `VAPI_API_KEY=... ./vapi/create-assistant.sh`
6. **Buy a phone number** in the Vapi dashboard (~$2/mo) and attach the assistant.
7. **Call it.** Test: pricing question, appointment booking, message taking,
   emergency escalation, an off-script question, "are you a robot?"
8. **Record your best demo call** — that recording is your #1 sales asset.
9. **Start outreach** with `PLAYBOOK.md` + your vertical pack's hooks.

## Per-client setup (under 2 hours once practiced)

1. 15-minute intake call (`onboarding/client-intake-form.md` + vertical pack questions).
2. Substitute answers into the `{{variables}}` in the system prompt; paste the
   vertical knowledge block.
3. Create a new assistant + phone number (each client gets their own).
4. Client forwards their line — after-hours only, or on no-answer after 4 rings
   (the low-risk pitch that closes deals).
5. Test-call together, tweak wording live, done.

## Costs at a glance (per client, per month)

~300 calls/mo × ~2.5 min ≈ 750 min → roughly **$80–110/mo** all-in
(platform + LLM + voice + transcription + telephony). At $497/mo you keep
~$390. Full math in `PLAYBOOK.md`; pricing anchors per niche in `verticals/`.
