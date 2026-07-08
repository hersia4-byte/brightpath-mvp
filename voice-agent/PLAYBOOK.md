# Sales Playbook — AI Phone Receptionist (Any Local-Service Business)

The playbook is industry-agnostic. Niche-specific hooks, pricing anchors, and
knowledge questions live in `verticals/` — pick the pack that matches your
prospect and layer it on top of everything here. New industry? Copy
`verticals/_template.md` and fill it in (~30 minutes).

## The offer (universal formula)

> "You're losing calls at exactly the moments you're busiest — and every missed
> call is a {{customer}} who dials your competitor. I built a receptionist that
> answers every call, answers questions with YOUR information, books
> {{appointments}} onto your calendar, and texts you a summary — for less per
> month than a day of part-time help. First 14 days free; if it doesn't book
> at least one {{appointment}}, cancel and pay nothing."

Three tiers — anchor high, sell the middle (adjust numbers per vertical pack):

| Tier | Price | What's included |
|---|---|---|
| After-Hours | $297/mo | Agent answers only when closed + on missed calls |
| **Full Reception** | **$497/mo** | 24/7 answering, appointment booking, messages, weekly summary |
| Multi-Site / Premium | $997/mo | Multiple locations or lines, monthly FAQ updates, priority support |

Setup fee: **$297** (waive it as a closing lever — "sign this week and setup is
free"). Sell the value of one recovered customer, never the cost of minutes.

## Unit economics

Per client per month, assuming ~300 calls averaging 2.5 minutes (750 min):

| Line item | Cost |
|---|---|
| Vapi platform (~$0.05/min) | ~$38 |
| LLM (gpt-4o class) | ~$5–10 |
| Voice synthesis | ~$25–50 |
| Transcription | ~$3 |
| Phone number + telephony | ~$8 |
| **Total** | **~$80–110** |

Margin at $497/mo: **~$390/client**. Ten clients ≈ $3,900/mo profit. The "set
up once" marketing claim is 80% true — the other 20%: prompt tweaks the first
two weeks, knowledge updates when their prices/availability change, and being
reachable when the client panics about something the agent said.

## Building the target list

- Google Maps: search your vertical within 15 miles. Export ~50.
- **Qualify by calling at their busiest hour** (the vertical pack tells you
  when). If nobody answers, they're a lead — and you have your opening line:
  "I called you yesterday and got voicemail. So did every customer who called."
- Prioritize businesses where the owner answers the phone — that's the decision
  maker, reachable without a gatekeeper.

## Outreach

**Cold call script (call during their calm hours):**

> "Hi, is this the owner? — I'll be 30 seconds. I called your {{business}}
> yesterday at {{busy time}} and got voicemail. I build phone receptionists for
> {{industry}} — AI, answers every call, books {{appointments}}, takes messages.
> Can I show you the fastest way possible? Call this number right now and ask it
> whatever a customer would ask you. [demo number] I'll wait — or I can text it."

The demo IS the pitch. Get them to call the agent — nothing you say is as
convincing as them hearing it.

**Cold email (subject: "Your phone at {{busy time}} yesterday"):**

> Hi {{Name}} — I called {{Business}} yesterday at {{busy time}} and got
> voicemail. Totally understandable — that's your busiest hour. But a customer
> who gets voicemail just calls the next {{business type}} on the list.
>
> I build AI receptionists for {{industry}}. It answers every call, answers
> questions from *your* info, books {{appointments}} onto your calendar, and
> texts you a summary of every call.
>
> Call it right now and try to stump it: {{demo number}}
>
> 14-day free trial, nothing to set up on your end beyond a 15-minute call.
> Worth a listen? — {{You}}

**Follow-up cadence:** Day 1 email → Day 3 call → Day 7 "did you call the
demo?" → Day 14 breakup email. Most yeses come on touch 3–4.

## The demo (10 minutes, on speakerphone)

Keep ONE demo agent per vertical you're actively selling, configured for a
fictional business (see `verticals/` for what to showcase per niche).

1. Have *them* call the demo agent and role-play a customer. (3 min)
2. Show the text/email summary that arrived while you talked. (1 min)
3. Show the appointment it booked on the shared calendar. (1 min)
4. "This one's configured for a fake {{business type}}. Yours would answer with
   your hours, your prices, your services. I need 15 minutes to set it up.
   Trial starts the day it goes live." (close)

Offer **no-answer forwarding** to nervous buyers: their phone rings 4 times at
the desk first; the agent only catches calls that would have hit voicemail.
Zero risk. Upgrade to 24/7 later.

## Objection handling (universal)

- **"Customers will hate talking to a robot."** — "It only takes calls you're
  missing today. The comparison isn't robot vs. human — it's robot vs.
  voicemail. Anything urgent, it transfers to a human immediately."
- **"What if it says something wrong?"** — "It only knows what you approve in
  setup. Anything outside that, it takes a message instead of guessing. You get
  a transcript of every call, and I personally review the first two weeks."
- **"We can't afford it."** — "What's one new {{customer}} worth to you over a
  year? This costs a fraction of that. If it doesn't book a single
  {{appointment}} in the trial, you don't pay."
- **"I need to think about it."** — "Sure. Keep the demo number — call it
  tonight, ask it what a customer would ask. I'll check in Friday."
- **Recording consent:** calls are recorded/transcribed — the greeting should
  say so per the client's state rules (two-party-consent states: CA, FL, IL,
  PA, WA among others). Industry-specific compliance (HIPAA, fair housing,
  childcare licensing) is in each vertical pack — read it before the pitch.

## After the close — onboarding SLA

- Day 0: intake call (`onboarding/client-intake-form.md` + vertical pack
  questions), sign simple month-to-month agreement.
- Day 1: agent configured, test call together, forwarding enabled.
- Days 1–14: skim transcripts daily, tighten the prompt.
- Ongoing: weekly summary email (calls answered, appointments booked, messages
  taken). That email is your retention engine — the invoice justification
  arriving every Monday.

## Scaling across verticals

- Master one vertical to 3–5 clients before opening a second — referrals
  compound inside an industry ("the daycare down the street uses it").
- Everything transfers between verticals except the pack file: same prompt
  skeleton, same tools, same webhook, same pitch structure.
- Expansion revenue per client: SMS follow-ups to bookers (+$100/mo),
  outbound reminders (+$100/mo), second language line (+$150/mo).
