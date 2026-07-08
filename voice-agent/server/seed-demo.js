// Seeds a realistic day of call traffic through the LIVE webhook — the same
// HTTP requests Vapi would send. Use it to demo the review dashboard to a
// prospect, or to smoke-test a fresh deployment.
//
//   node webhook.js &         # start the server first
//   node seed-demo.js         # then seed (WEBHOOK=http://host:port to override)

const BASE = process.env.WEBHOOK || 'http://localhost:3100';

async function send(message) {
  const res = await fetch(`${BASE}/vapi/${message.type === 'tool-calls' ? 'tools' : 'events'}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json().catch(() => ({}));
}

const tool = (callId, name, args) => send({
  type: 'tool-calls', call: { id: callId },
  toolCallList: [{ id: 'tc', function: { name, arguments: JSON.stringify(args) } }],
});

const report = (callId, durationSeconds, summary, pass, transcript) => send({
  type: 'end-of-call-report', call: { id: callId },
  durationSeconds, transcript,
  analysis: { summary, successEvaluation: pass ? 'Pass' : 'Fail' },
});

// Call 1: new-customer inquiry → tour booked
await tool('call-1', 'checkAvailability', { day: 'Thursday' });
await tool('call-1', 'bookAppointment', {
  callerName: 'Maria Lopez', phone: '555-0142', appointmentType: 'facility tour',
  day: 'Thursday', time: '10am', details: 'Child is 2 years old, interested in toddler program',
});
await report('call-1', 187,
  'Maria Lopez asked about toddler program tuition and openings. Both answered from approved info; booked a facility tour for Thursday at 10 AM.',
  true,
  'AI: Thanks for calling Demo Business! This is Sunny, the center\'s virtual assistant. How can I help you today?\nCaller: Hi, do you have openings for a two-year-old?\nAI: We do! Our toddler room currently has two openings. Would you like to come see the center?\nCaller: How much is tuition first?\nAI: Toddler tuition is three twenty-five a week, including meals. The best way to get a feel for us is a quick tour — can I set one up for you?\nCaller: Sure, Thursday morning?\nAI: Let me check... On Thursday we have 9 AM, 10 AM, and 11 AM open. What works best?\nCaller: 10.\nAI: So that\'s a tour Thursday at 10 AM — can I get your name and number?\nCaller: Maria Lopez, 555-0142.\nAI: Maria, 555-0142, Thursday at 10 for your two-year-old — did I get that right?\nCaller: Yes!\nAI: You\'re all set, Maria — we\'ll see you and your little one Thursday at 10. You\'ll get a confirmation shortly!');

// Call 2: absence message
await tool('call-2', 'takeMessage', {
  callerName: 'James Porter', phone: '555-0198', category: 'absence',
  message: 'Son Eli staying home with a cold today, back tomorrow.',
});
await report('call-2', 64,
  'James Porter reported his son Eli absent today due to a cold. Message recorded for staff.',
  true,
  'AI: Thanks for calling Demo Business! How can I help?\nCaller: Hi, just letting you know Eli Porter is staying home sick today.\nAI: Sorry to hear that — I\'ll let the team know. Can I get your name and a callback number just in case?\nCaller: James Porter, 555-0198.\nAI: Got it — feel better, Eli! Anything else?\nCaller: No, thanks.');

// Call 3: caller wanted a full day; agent offered next opening
await tool('call-3', 'checkAvailability', { day: 'Thursday' });
await tool('call-3', 'bookAppointment', {
  callerName: 'Dana W', phone: '555-0175', appointmentType: 'facility tour',
  day: 'Thursday', time: '11am', details: 'Infant, due to start in September',
});
await report('call-3', 145,
  'Dana W wanted Thursday 10 AM but it was taken; agent offered open times and booked 11 AM instead. Infant enrollment for September.',
  true, null);

// Call 4: question outside approved info → message + flagged for review
await tool('call-4', 'takeMessage', {
  callerName: 'Priya Natarajan', phone: '555-0111', category: 'callback',
  message: 'Asked whether the center offers sibling discounts for twins. Not in approved info — needs a callback from the director.',
});
await report('call-4', 92,
  'Caller asked about sibling discounts for twins, which is not in the approved information. Agent took a callback message rather than guessing. Director should call back and consider adding a discount answer to the FAQ.',
  false, null);

console.log('Seeded 4 calls: 2 tours booked, 2 messages, 1 flagged for review.');
console.log(`Open ${BASE}/report to see the dashboard.`);
