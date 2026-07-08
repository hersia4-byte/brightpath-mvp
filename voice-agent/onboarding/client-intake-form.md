# Client Intake Form — 15-Minute Setup Call

Industry-agnostic core form. Every answer maps to a `{{VARIABLE}}` in
`prompts/system-prompt.md`. Also ask the **additional questions from the
client's vertical pack** in `verticals/` — those fill the
`{{VERTICAL_KNOWLEDGE_BLOCK}}`.

Read the client's website first and pre-fill what you can — the call should be
confirmation, not homework for them.

## Basics

| Variable | Question | Answer |
|---|---|---|
| `BUSINESS_NAME` | Exact name as answered on the phone | |
| `BUSINESS_TYPE` | One phrase: "childcare center", "dental practice", "property management company"… | |
| `BUSINESS_TYPE_SHORT` | Short form for the greeting: "center", "office", "clinic", "shop" | |
| `AGENT_NAME` | What should the assistant be called? (pick something friendly) | |
| `CITY_STATE` | City and state | |
| `OWNER_NAME` | Who should callbacks reference? | |
| `HOURS` | Days and hours, incl. closures worth mentioning | |
| `ADDRESS_AND_DIRECTIONS` | Address + parking/entrance instructions (or "we come to you") | |
| `SERVICE_AREA` | Geographic area served, if applicable | |

## Services & money

| Variable | Question | Answer |
|---|---|---|
| `SERVICES_SUMMARY` | Main services/offerings, 1 line each | |
| `PRICING_SUMMARY` | Prices they're comfortable stating on the phone (or "quoted after a visit") | |
| `AVAILABILITY` | Current openings / lead time / next available slot (update monthly!) | |
| `POLICIES_SUMMARY` | Cancellation, payment, and any policy callers ask about | |
| `CREDENTIALS` | License numbers, insurance, certifications, accreditations to state if asked | |
| `ABOUT_BLURB` | 2 sentences on the business (their words, from their site) | |
| `EXTRA_FAQS` | Top 5 questions their phone actually gets, with approved answers | |

## Appointments

| Variable | Question | Answer |
|---|---|---|
| `APPOINTMENT_TYPE` | What gets booked? (tour, consultation, estimate, showing, cleaning…) | |
| `APPOINTMENT_VERB` | How a caller says it: "book a tour", "get an estimate", "schedule a showing" | |
| `APPOINTMENT_SLOTS` | When are these available? (e.g., "Tue/Thu 10am–2pm") | |
| `APPOINTMENT_EXTRA_FIELDS` | Extra info to collect (from vertical pack, e.g. child's age, property address, insurance carrier) | |
| `APPOINTMENT_CONFIRM_EXAMPLE` | A natural confirm-back phrase for this business | |
| `APPOINTMENT_OFFER_LINE` | The one-liner pitch to book: "The best way to get a feel for us is to visit — can I set that up?" | |

## Escalation & messages

| Variable | Question | Answer |
|---|---|---|
| `MESSAGE_CATEGORIES` | 2–4 message types beyond "general" (from vertical pack) | |
| `EMERGENCY_EXAMPLES` | What counts as an emergency for this business? | |
| `EMERGENCY_TRANSFER_NUMBER` | Number to forward emergencies to during hours | |
| `VERTICAL_PRIVACY_RULE` | Any industry privacy rule (from vertical pack; leave default otherwise) | |
| `GREETING` | Confirm the first message wording (read it to them) | |

## Also collect (not prompt variables)

- Where appointment bookings should go: email, and calendar if they use one
- Cell number for the daily/weekly summary text or email
- Forwarding preference: **after-hours only**, **no-answer after 4 rings**, or 24/7
- Who is the day-to-day contact for tweaks
- Confirm: "Your greeting should mention calls may be recorded — want me to
  include that in the assistant's greeting?" (required in two-party-consent
  states like CA, FL, IL, PA, WA)

## Before go-live checklist

- [ ] All variables substituted (core + vertical pack), prompt proofread aloud
- [ ] Test calls: pricing question, appointment booking, message taking,
      emergency escalation, off-script question, "are you a robot?"
- [ ] Summary email/text arriving at the right address
- [ ] Forwarding tested from the client's actual line
- [ ] Client has your cell for week-one concerns
