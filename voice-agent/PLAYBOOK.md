# Sales Playbook — AI Receptionist for Childcare Centers

## The offer

> "Your front desk can't answer the phone at 5:15pm. I built a receptionist that
> answers every call, books tours onto your calendar, and texts you a summary —
> for less per month than one day of a part-time hire. First 14 days free; if it
> doesn't book you at least one tour, cancel and pay nothing."

Three tiers — anchor high, sell the middle:

| Tier | Price | What's included |
|---|---|---|
| After-Hours | $297/mo | Agent answers only when closed + on missed calls |
| **Full Reception** | **$497/mo** | 24/7 answering, tour booking, message taking, weekly summary email |
| Multi-Site | $997/mo | Up to 3 locations, custom FAQ updates monthly, priority support |

Setup fee: **$297** (waive it as a closing lever — "sign this week and setup is free").

Why these prices work: a part-time front-desk hire is $1,400+/mo. One enrollment
is worth $10k–$20k/yr. You are not selling minutes of phone answering; you are
selling not losing an enrollment to the daycare down the street that picked up.

## Unit economics

Per client per month, assuming ~300 calls averaging 2.5 minutes (750 min):

| Line item | Cost |
|---|---|
| Vapi platform (~$0.05/min) | ~$38 |
| LLM (gpt-4o-mini class) | ~$5–10 |
| Voice synthesis (11labs/etc.) | ~$25–50 |
| Transcription (Deepgram) | ~$3 |
| Phone number + telephony | ~$8 |
| **Total** | **~$80–110** |

Margin at $497/mo: **~$390/client**. Ten clients ≈ $3,900/mo profit for what
becomes a few hours a month of maintenance. The "set up once" claim in marketing
emails is 80% true — the other 20% is: prompt tweaks the first two weeks, FAQ
updates when tuition changes, and being reachable when the client panics about
something the agent said.

## Building the target list

- Google Maps: "daycare" / "preschool" / "childcare" within 15 miles. Export ~50.
- **Qualify by calling them at 5:00–5:45pm.** If nobody answers, they're a lead —
  and you now have your opening line: "I called you yesterday at 5:20 and got
  voicemail. So did every parent who called."
- Prioritize: multi-classroom centers (not home daycares), centers with waitlists
  or active tour scheduling on their site, and owners (decision maker answers the
  phone at small centers — that's your in).

## Outreach

**Cold call script (call at 9:30–11am, after drop-off calms down):**

> "Hi, is this the director? — I'll be 30 seconds. I called your center yesterday
> at 5:20 and got voicemail. I build phone receptionists for childcare centers —
> AI, answers every call, books tours, takes absence messages. Can I show you in
> the fastest way possible? Call this number right now and ask it whatever a
> parent would ask you. [give demo number] I'll wait — or I can text it to you."

The demo *is* the pitch. Get them to call the agent. Nothing you say is as
convincing as them hearing it.

**Cold email (subject: "Your phone at 5:20pm yesterday"):**

> Hi {{Name}} — I called {{Center}} yesterday at 5:20pm and got voicemail.
> Totally understandable — that's pickup chaos. But a parent shopping for care
> who gets voicemail just calls the next center on the list.
>
> I build AI receptionists for childcare centers. It answers every call, answers
> tuition/enrollment questions from *your* info, books tours onto your calendar,
> and texts you a summary of every call.
>
> Call it right now and try to stump it: {{demo number}}
>
> 14-day free trial, no setup work on your end beyond a 15-minute call with me.
> Worth a listen? — {{You}}

**Follow-up cadence:** Day 1 email → Day 3 call → Day 7 email ("did you get a
chance to call the demo?") → Day 14 breakup email ("closing your file — here's
the demo number if it's ever useful"). Most yeses come on touch 3–4.

## The demo (10 minutes, on speakerphone)

1. Have *them* call the demo agent and role-play a parent. (3 min)
2. Show the text/email summary that arrived while you talked. (1 min)
3. Show the tour it booked on the shared calendar. (1 min)
4. "This one's configured for a fake center. Yours would answer with your hours,
   your tuition, your programs. I need 15 minutes of your time to set it up.
   Trial starts the day it goes live." (close)

Offer the **no-answer-forwarding** version to nervous buyers: their phone rings
4 times at the front desk first; the agent only picks up calls that would have
hit voicemail anyway. Zero risk. Upgrade them to 24/7 later.

## Objection handling

- **"Parents will hate talking to a robot."** — "It only takes calls you're
  missing today. The comparison isn't robot vs. human — it's robot vs. voicemail.
  And it hands off: anything urgent, it says 'let me get the director' and
  forwards or texts you immediately."
- **"What if it says something wrong?"** — "It only knows what you approve in
  setup. Anything outside that, it takes a message instead of guessing. You get a
  transcript of every call, and I review the first two weeks personally."
- **"We can't afford it."** — "What's one enrollment worth to you over a year?
  This costs less than 5% of that. If it doesn't book a single tour in the
  trial, you don't pay."
- **"I need to think about it."** — "Sure. Keep the demo number — call it
  tonight after close, ask it what a parent would ask. I'll check in Friday."
- **Licensing/privacy concerns:** — Don't overpromise. The agent takes routine
  messages and books tours; it doesn't collect children's records or replace
  required staff communications. Calls are recorded/transcribed — the client
  should add "calls may be recorded" to their greeting per their state's consent
  rules (flag two-party-consent states like CA, FL, IL, PA, WA).

## After the close — onboarding SLA

- Day 0: intake call (see `onboarding/client-intake-form.md`), sign simple
  month-to-month agreement (cancel anytime — makes buying painless).
- Day 1: agent configured, test call together, forwarding enabled.
- Days 1–14: you personally skim call transcripts daily, tighten the prompt.
- Ongoing: weekly summary email (call count, tours booked, messages taken).
  That email is your retention engine — it's the invoice justification arriving
  every Monday.

## Expansion revenue (once you have 5+ happy clients)

- SMS follow-up to every tour-booker (+$100/mo)
- Waitlist callbacks when a spot opens (+$100/mo)
- Spanish-language line (+$150/mo)
- Same product, adjacent niches: pediatric dentists, vets, home-services —
  everything transfers except the FAQ content.
