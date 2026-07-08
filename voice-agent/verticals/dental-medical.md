# Vertical Pack — Dental & Private Medical Practices

## Why this niche

A new dental patient is worth $700–$1,500/year (much more with implants/ortho).
Front desk is busy with in-person patients; hold times kill new-patient calls.
Practices already pay $2,000+/mo for answering services that just take messages
— you're cheaper AND better. Higher compliance bar, higher willingness to pay.

## Positioning line

> "Your front desk is checking in a patient while a new-patient call rings out.
> That call was worth a thousand dollars a year."

## Pricing anchor

**$597** / $997 (single practice / multi-location). This niche pays more —
don't price like a daycare. Justify against their current answering service
cost plus one new patient per month.

## Core variable suggestions

| Variable | Suggested value |
|---|---|
| `AGENT_NAME` | Claire |
| `APPOINTMENT_TYPE` | appointment (new-patient exam, cleaning, consult) |
| `APPOINTMENT_VERB` | schedule an appointment |
| `APPOINTMENT_EXTRA_FIELDS` | new or existing patient; reason for visit (general terms); insurance carrier |
| `APPOINTMENT_OFFER_LINE` | "I can get you on the schedule — are mornings or afternoons better?" |
| `MESSAGE_CATEGORIES` | reschedule, billing, prescription_refill, callback |
| `EMERGENCY_EXAMPLES` | severe pain, uncontrolled bleeding, knocked-out tooth, post-op complications |

## `{{VERTICAL_KNOWLEDGE_BLOCK}}` — extra intake questions

- Services offered (cleanings, implants, ortho, whitening…)
- Insurance carriers accepted / out-of-network policy / membership plan
- New patient process: what to bring, how early to arrive, forms link
- Payment options (CareCredit, payment plans)
- Emergency protocol: same-day slots? After-hours emergency line?

## `{{VERTICAL_PRIVACY_RULE}}` (strict — set expectations with the client)

> Never discuss any patient's health information, appointment history, or even
> confirm that someone IS a patient. For anything involving a specific
> patient's records, chart, or condition: take a callback message only.
> Collect the caller's stated reason for visit in general terms; do not probe
> for medical detail.

## Compliance notes (be straight with the buyer)

- Position the agent for scheduling and general questions — NOT for medical
  advice, triage, or accessing patient records. It never connects to their PMS
  in v1; it books requests that staff confirm.
- HIPAA: call recordings/transcripts can contain PHI. Use a platform
  configuration with a BAA where required, or configure no-recording for
  medical clients. Say this proactively — it builds trust and kills the
  competitor who didn't think about it.
- Emergencies: the agent must always offer 911 language for anything
  life-threatening and transfer clinical questions to staff.
