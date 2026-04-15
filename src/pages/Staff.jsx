import { useState } from 'react'

const STAFF = [
  { id: 1, name: 'Aisha Coleman', role: 'Lead Teacher', room: 'Sunshine', schedule: 'Mon-Fri 7am-3pm', phone: '(763) 555-0201', email: 'aisha@brightpath.com', cpr: '2026-08-15', firstAid: '2026-08-15', dcyf: '2025-11-01', fingerprint: '2025-03-10', hired: '2022-09-01', status: 'Active', children: 5 },
  { id: 2, name: 'Marcus Rivera', role: 'Assistant Teacher', room: 'Rainbow', schedule: 'Mon-Fri 8am-4pm', phone: '(763) 555-0202', email: 'marcus@brightpath.com', cpr: '2025-12-20', firstAid: '2025-12-20', dcyf: '2025-06-15', fingerprint: '2024-09-22', hired: '2023-01-10', status: 'Active', children: 4 },
  { id: 3, name: 'Priya Nair', role: 'Lead Teacher', room: 'Starlight', schedule: 'Tue-Sat 7am-3pm', phone: '(763) 555-0203', email: 'priya@brightpath.com', cpr: '2026-03-05', firstAid: '2026-03-05', dcyf: '2026-02-28', fingerprint: '2025-01-14', hired: '2021-06-15', status: 'Active', children: 5 },
  { id: 4, name: 'Deja Watkins', role: 'Floater', room: 'All', schedule: 'Mon-Fri 9am-5pm', phone: '(763) 555-0204', email: 'deja@brightpath.com', cpr: '2025-10-18', firstAid: '2025-11-30', dcyf: '2025-05-01', fingerprint: '2024-12-05', hired: '2023-08-01', status: 'Active', children: 3 },
  { id: 5, name: 'Tom Lindqvist', role: 'Director', room: 'Office', schedule: 'Mon-Fri 8am-5pm', phone: '(763) 555-0205', email: 'tom@brightpath.com', cpr: '2026-05-22', firstAid: '2026-05-22', dcyf: '2026-01-10', fingerprint: '2025-04-01', hired: '2020-03-01', status: 'Active', children: 0 },
]

const ROOMS = [
  { name: 'Sunshine', lead: 'Aisha Coleman', children: 5, capacity: 6, ratio: '1:5' },
  { name: 'Rainbow', lead: 'Marcus Rivera', children: 4, capacity: 6, ratio: '1:4' },
  { name: 'Starlight', lead: 'Priya Nair', children: 5, capacity: 6, ratio: '1:5' },
]

const AVATAR_COLORS = ['#7c3aed','#0891b2','#059669','#d97706','#4f46e5']

function certStatus(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: 'Expired', color: '#dc2626', bg: '#fee2e2' }
  if (diffDays <= 90) return { label: `Exp ${dateStr}`, color: '#d97706', bg: '#fef3c7' }
  return { label: `Valid to ${dateStr}`, color: '#059669', bg: '#d1fae5' }
}

export default function Staff() {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('Roster')

  const expiringSoon = STAFF.filter(s => {
    const dates = [s.cpr, s.firstAid, s.dcyf]
    return dates.some(d => {
      const diff = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24))
      return diff >= 0 && diff <= 90
    })
  })

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Staff</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Team roster, certifications & room ratios</p>
        </div>
        <button style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          + Add Staff
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Staff', value: STAFF.length, color: '#4f46e5', icon: '👩‍🏫' },
          { label: 'Active Today', value: STAFF.filter(s => s.status === 'Active').length, color: '#059669', icon: '✅' },
          { label: 'Certs Expiring', value: expiringSoon.length, color: '#d97706', icon: '⚠️' },
          { label: 'Avg Ratio', value: '1:4.7', color: '#0891b2', icon: '📊' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Expiring Cert Alert */}
      {expiringSoon.length > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
            {expiringSoon.map(s => s.name).join(', ')} — certifications expiring within 90 days. Schedule renewals.
          </span>
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['Roster', 'Room Ratios', 'Certifications'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#4f46e5' : '#64748b',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }}
          >{t}</button>
        ))}
      </div>

      {/* Roster Tab */}
      {tab === 'Roster' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Staff Member','Role','Room','Schedule','Phone','Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAFF.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === s.id ? '#f0f9ff' : 'transparent' }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{s.role}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '3px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.room}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{s.schedule}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{s.phone}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Room Ratios Tab */}
      {tab === 'Room Ratios' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {ROOMS.map(r => {
            const pct = (r.children / r.capacity) * 100
            const ok = pct <= 83
            return (
              <div key={r.name} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: `2px solid ${ok ? '#d1fae5' : '#fee2e2'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: 18 }}>{r.name} Room</h3>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Lead: {r.lead}</div>
                  </div>
                  <span style={{ background: ok ? '#d1fae5' : '#fee2e2', color: ok ? '#166534' : '#dc2626', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                    {ok ? 'OK' : 'OVER'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Children</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.children} / {r.capacity}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: 8, height: 10, marginBottom: 12 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: ok ? '#059669' : '#dc2626', borderRadius: 8, transition: 'width .5s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Staff Ratio</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>{r.ratio}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>MN requirement: max 1:6 for ages 3-5</div>
              </div>
            )
          })}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 32 }}>+</div>
            <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Add Room</div>
          </div>
        </div>
      )}

      {/* Certifications Tab */}
      {tab === 'Certifications' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Staff Member','CPR/AED','First Aid','DCYF Background','Fingerprints','Hired'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAFF.map((s, i) => {
                const cpr = certStatus(s.cpr)
                const fa = certStatus(s.firstAid)
                const dcyf = certStatus(s.dcyf)
                const fp = certStatus(s.fingerprint)
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{s.name}</span>
                      </div>
                    </td>
                    {[cpr, fa, dcyf, fp].map((cert, idx) => (
                      <td key={idx} style={{ padding: '14px 16px' }}>
                        <span style={{ background: cert.bg, color: cert.color, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{cert.label}</span>
                      </td>
                    ))}
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{s.hired}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Panel */}
      {selected && tab === 'Roster' && (
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '2px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>{selected.name}</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 16 }}>
            {[['Role', selected.role], ['Room', selected.room], ['Phone', selected.phone], ['Email', selected.email], ['Schedule', selected.schedule], ['Hired', selected.hired], ['CPR Exp', selected.cpr], ['DCYF Exp', selected.dcyf]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
