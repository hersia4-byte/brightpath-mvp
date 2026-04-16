import { useState } from 'react'

const WEEKLY_ATTENDANCE = [
  { day: 'Mon', present: 7, total: 7 },
  { day: 'Tue', present: 6, total: 7 },
  { day: 'Wed', present: 7, total: 7 },
  { day: 'Thu', present: 5, total: 7 },
  { day: 'Fri', present: 7, total: 7 },
]

const UPCOMING_EVENTS = [
  { date: 'Apr 16', day: 'Thu', title: 'DCYF Licensing Renewal Prep', type: 'compliance', icon: '📋' },
  { date: 'Apr 18', day: 'Sat', title: "Earth Day Art Activity", type: 'activity', icon: '🌱' },
  { date: 'Apr 22', day: 'Wed', title: 'Marcus CPR Recertification Due', type: 'staff', icon: '❤️' },
  { date: 'Apr 30', day: 'Thu', title: 'Monthly Billing Run', type: 'billing', icon: '💰' },
  { date: 'May 1', day: 'Fri', title: "Parent Appreciation Day", type: 'activity', icon: '🎉' },
]

const RECENT_ACTIVITY = [
  { time: '8:12 AM', action: 'Amara Johnson checked in via GPS', icon: '📍', color: '#4f46e5' },
  { time: '8:24 AM', action: 'INV-005 marked paid — $1,200 ACH', icon: '💰', color: '#059669' },
  { time: '8:31 AM', action: 'Mia Thompson checked in via GPS', icon: '📍', color: '#4f46e5' },
  { time: '9:05 AM', action: 'Compliance item updated: Fire drill logged', icon: '✅', color: '#059669' },
  { time: '9:48 AM', action: 'INV-003 overdue — Sofia Martinez (30 days)', icon: '🚨', color: '#dc2626' },
]

const TYPE_COLORS = { compliance: '#fee2e2', activity: '#d1fae5', staff: '#e0f2fe', billing: '#fef3c7' }
const TYPE_TEXT = { compliance: '#7f1d1d', activity: '#166534', staff: '#0369a1', billing: '#92400e' }

export default function Dashboard() {
  const enrolled = 7
  const capacity = 12
  const waitlist = 2
  const enrollPct = Math.round((enrolled / capacity) * 100)

  const todayAttendance = WEEKLY_ATTENDANCE.find(d => d.day === 'Wed')
  const attendancePct = Math.round((todayAttendance.present / todayAttendance.total) * 100)

  const maxAttend = Math.max(...WEEKLY_ATTENDANCE.map(d => d.total))

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Good morning, Director</h1>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Wednesday, April 15, 2026 — BrightPath Childcare</p>
      </div>

      {/* Top KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Enrolled Children', value: enrolled, sub: `${capacity - enrolled} open slots`, color: '#4f46e5', bg: '#ede9fe', icon: '👶' },
          { label: "Today's Attendance", value: `${todayAttendance.present}/${todayAttendance.total}`, sub: `${attendancePct}% present`, color: '#059669', bg: '#d1fae5', icon: '✅' },
          { label: 'Monthly Revenue', value: '$4,300', sub: '$3,300 pending', color: '#0891b2', bg: '#e0f2fe', icon: '💰' },
          { label: 'Open Compliance', value: 2, sub: 'Items need attention', color: '#dc2626', bg: '#fee2e2', icon: '⚠️' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{k.label}</div>
              <div style={{ width: 36, height: 36, background: k.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Enrollment Donut */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Enrollment Overview</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="50" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                <circle cx="65" cy="65" r="50" fill="none" stroke="#4f46e5" strokeWidth="18"
                  strokeDasharray={`${2 * Math.PI * 50 * enrollPct / 100} ${2 * Math.PI * 50}`}
                  strokeDashoffset={2 * Math.PI * 50 * 0.25}
                  strokeLinecap="round" />
                <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#0f172a">{enrolled}</text>
                <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#94a3b8">enrolled</text>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Enrolled', value: enrolled, color: '#4f46e5', pct: enrollPct },
                { label: 'Waitlist', value: waitlist, color: '#f59e0b', pct: Math.round((waitlist / capacity) * 100) },
                { label: 'Open Slots', value: capacity - enrolled, color: '#e2e8f0', pct: Math.round(((capacity - enrolled) / capacity) * 100) },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.value}</span>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: 6, height: 6 }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
                License capacity: <strong style={{ color: '#0f172a' }}>{capacity} children</strong> — {capacity - enrolled} spots available
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Attendance Chart */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>This Week's Attendance</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 140, paddingBottom: 4 }}>
            {WEEKLY_ATTENDANCE.map(d => {
              const h = (d.present / maxAttend) * 120
              const isToday = d.day === 'Wed'
              const pct = Math.round((d.present / d.total) * 100)
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{d.present}</div>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '70%', height: h, background: isToday ? '#4f46e5' : '#c7d2fe', borderRadius: '4px 4px 0 0', transition: 'height .5s' }} />
                    {isToday && (
                      <div style={{ position: 'absolute', top: -22, background: '#4f46e5', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        Today
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: isToday ? '#4f46e5' : '#94a3b8', fontWeight: isToday ? 700 : 400 }}>{d.day}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Weekly Avg</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>6.4 / 7</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Attendance Rate</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>91%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Absences</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#d97706' }}>3 this week</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Upcoming Events */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Upcoming Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {UPCOMING_EVENTS.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, background: TYPE_COLORS[e.type], border: `1px solid ${TYPE_COLORS[e.type]}` }}>
                <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 40 }}>
                  <div style={{ fontSize: 11, color: TYPE_TEXT[e.type], fontWeight: 700, textTransform: 'uppercase' }}>{e.day}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: TYPE_TEXT[e.type] }}>{e.date.split(' ')[1]}</div>
                </div>
                <div style={{ width: 1, height: 32, background: TYPE_TEXT[e.type], opacity: 0.2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TYPE_TEXT[e.type] }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: TYPE_TEXT[e.type], opacity: 0.7, marginTop: 2, textTransform: 'capitalize' }}>{e.type}</div>
                </div>
                <div style={{ fontSize: 20 }}>{e.icon}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Today's Activity Feed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 16, position: 'relative' }}>
                {i < RECENT_ACTIVITY.length - 1 && (
                  <div style={{ position: 'absolute', left: 18, top: 36, bottom: 0, width: 2, background: '#f1f5f9' }} />
                )}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}15`, border: `2px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, zIndex: 1 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'GPS Check-ins', value: 7, color: '#4f46e5' },
              { label: 'Payments Today', value: 1, color: '#059669' },
              { label: 'Alerts', value: 2, color: '#dc2626' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 8px', background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
