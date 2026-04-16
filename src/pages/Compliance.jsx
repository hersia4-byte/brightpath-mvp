import { useState } from 'react'

const LICENSE = {
  number: 'MN-CCL-2024-00312',
  issued: '2024-09-01',
  expires: '2026-09-01',
  capacity: 12,
  type: 'Group Family Child Care',
  status: 'Active',
  lastInspection: '2025-11-14',
  inspector: 'DCYF — Region 7',
}

const BACKGROUND_CHECKS = [
  { name: 'Tom Lindqvist', role: 'Director', type: 'DCYF/DHS', completed: '2026-01-10', expires: '2028-01-10', status: 'Clear' },
  { name: 'Aisha Coleman', role: 'Lead Teacher', type: 'DCYF/DHS', completed: '2025-11-01', expires: '2027-11-01', status: 'Clear' },
  { name: 'Marcus Rivera', role: 'Asst Teacher', type: 'DCYF/DHS', completed: '2025-06-15', expires: '2027-06-15', status: 'Clear' },
  { name: 'Priya Nair', role: 'Lead Teacher', type: 'DCYF/DHS', completed: '2026-02-28', expires: '2028-02-28', status: 'Clear' },
  { name: 'Deja Watkins', role: 'Floater', type: 'DCYF/DHS', completed: '2025-05-01', expires: '2027-05-01', status: 'Clear' },
]

const TRAINING_LOG = [
  { name: 'Tom Lindqvist', training: 'Director Orientation', provider: 'MN DHS', date: '2024-08-15', hours: 12, status: 'Complete' },
  { name: 'Aisha Coleman', training: 'Child Development Associate', provider: 'Concordia Univ', date: '2024-06-01', hours: 120, status: 'Complete' },
  { name: 'All Staff', training: 'Annual Mandatory Reporter Training', provider: 'MN DHS Online', date: '2025-09-10', hours: 2, status: 'Complete' },
  { name: 'Marcus Rivera', training: 'Annual Training (16 hrs)', provider: 'Various', date: '2026-12-31', hours: 9, status: 'In Progress' },
  { name: 'Deja Watkins', training: 'Inclusion & Special Needs', provider: 'PACER Center', date: '2025-07-20', hours: 6, status: 'Complete' },
  { name: 'Priya Nair', training: 'Annual Training (16 hrs)', provider: 'Various', date: '2026-12-31', hours: 16, status: 'Complete' },
]

const DCYF_CHECKLIST = [
  { category: 'Licensing', item: 'Current license posted in visible location', status: true },
  { category: 'Licensing', item: 'License capacity not exceeded (max 12)', status: true },
  { category: 'Safety', item: 'Smoke detectors tested monthly', status: true },
  { category: 'Safety', item: 'Carbon monoxide detector present & tested', status: true },
  { category: 'Safety', item: 'Fire extinguisher inspected', status: true },
  { category: 'Safety', item: 'Emergency evacuation plan posted', status: true },
  { category: 'Safety', item: 'First aid kit stocked & accessible', status: true },
  { category: 'Records', item: 'Child files current & locked', status: true },
  { category: 'Records', item: 'Medication log up to date', status: false },
  { category: 'Records', item: 'Incident/injury log maintained', status: true },
  { category: 'Staff', item: 'All staff background checks current', status: true },
  { category: 'Staff', item: 'CPR/First Aid certs within 2 years', status: false },
  { category: 'Staff', item: 'Mandatory reporter training current', status: true },
  { category: 'Nutrition', item: 'CACFP meal records maintained', status: true },
  { category: 'Nutrition', item: 'Allergy plans on file for affected children', status: true },
]

const CATEGORIES = ['All', ...new Set(DCYF_CHECKLIST.map(i => i.category))]

export default function Compliance() {
  const [tab, setTab] = useState('Overview')
  const [catFilter, setCatFilter] = useState('All')

  const passed = DCYF_CHECKLIST.filter(i => i.status).length
  const total = DCYF_CHECKLIST.length
  const pct = Math.round((passed / total) * 100)

  const daysToLicenseExpiry = Math.ceil((new Date(LICENSE.expires) - new Date()) / (1000 * 60 * 60 * 24))
  const daysToNextInspection = Math.ceil((new Date('2026-11-14') - new Date()) / (1000 * 60 * 60 * 24))

  const filteredChecklist = catFilter === 'All' ? DCYF_CHECKLIST : DCYF_CHECKLIST.filter(i => i.category === catFilter)

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Compliance</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>License status, background checks & DCYF requirements</p>
        </div>
        <button style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'DCYF Score', value: `${pct}%`, color: pct >= 90 ? '#059669' : '#d97706', icon: '📋' },
          { label: 'License Expires', value: `${daysToLicenseExpiry}d`, color: daysToLicenseExpiry > 180 ? '#059669' : '#d97706', icon: '📜' },
          { label: 'Next Inspection', value: `~${daysToNextInspection}d`, color: '#0891b2', icon: '🔍' },
          { label: 'Open Items', value: total - passed, color: total - passed === 0 ? '#059669' : '#dc2626', icon: '🚨' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 32 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(total - passed) > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#7f1d1d', fontWeight: 600, marginBottom: 4 }}>Open Compliance Items</div>
          {DCYF_CHECKLIST.filter(i => !i.status).map((item, i) => (
            <div key={i} style={{ fontSize: 13, color: '#991b1b', marginTop: 4 }}>• {item.item}</div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['Overview', 'DCYF Checklist', 'Background Checks', 'Training Log'].map(t => (
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

      {/* Overview */}
      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* License Card */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '2px solid #d1fae5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: 17 }}>Operating License</h3>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>ACTIVE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['License #', LICENSE.number],
                ['Type', LICENSE.type],
                ['Issued', LICENSE.issued],
                ['Expires', LICENSE.expires],
                ['Max Capacity', LICENSE.capacity],
                ['Last Inspection', LICENSE.lastInspection],
                ['Inspector', LICENSE.inspector],
                ['Days Remaining', daysToLicenseExpiry],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Score */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#0f172a', fontSize: 17 }}>DCYF Readiness Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 90 ? '#059669' : '#d97706'} strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40 * pct / 100} ${2 * Math.PI * 40}`}
                    strokeDashoffset={2 * Math.PI * 40 * 0.25}
                    strokeLinecap="round" />
                  <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill={pct >= 90 ? '#059669' : '#d97706'}>{pct}%</text>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 700, color: pct >= 90 ? '#059669' : '#d97706' }}>{passed}/{total}</div>
                <div style={{ fontSize: 14, color: '#64748b' }}>Requirements met</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Updated {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            {CATEGORIES.filter(c => c !== 'All').map(cat => {
              const catItems = DCYF_CHECKLIST.filter(i => i.category === cat)
              const catPassed = catItems.filter(i => i.status).length
              const catPct = (catPassed / catItems.length) * 100
              return (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{cat}</span>
                    <span style={{ fontSize: 13, color: catPassed === catItems.length ? '#059669' : '#d97706', fontWeight: 600 }}>{catPassed}/{catItems.length}</span>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: 6, height: 8 }}>
                    <div style={{ width: `${catPct}%`, height: '100%', background: catPassed === catItems.length ? '#059669' : '#d97706', borderRadius: 6, transition: 'width .5s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* DCYF Checklist */}
      {tab === 'DCYF Checklist' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{ padding: '7px 14px', border: '1px solid', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500,
                  background: catFilter === c ? '#4f46e5' : '#fff', color: catFilter === c ? '#fff' : '#475569', borderColor: catFilter === c ? '#4f46e5' : '#e2e8f0' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredChecklist.map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,.04)', border: `1px solid ${item.status ? '#d1fae5' : '#fecaca'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{item.status ? '✅' : '❌'}</span>
                  <div>
                    <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{item.item}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Category: {item.category}</div>
                  </div>
                </div>
                <span style={{ background: item.status ? '#dcfce7' : '#fee2e2', color: item.status ? '#166534' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {item.status ? 'Met' : 'Action Needed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Checks */}
      {tab === 'Background Checks' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Staff Member', 'Role', 'Check Type', 'Completed', 'Expires', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BACKGROUND_CHECKS.map((b, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{b.name}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{b.role}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{b.type}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{b.completed}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{b.expires}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Training Log */}
      {tab === 'Training Log' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Staff', 'Training', 'Provider', 'Date', 'Hours', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRAINING_LOG.map((t, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{t.name}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{t.training}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{t.provider}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{t.date}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600 }}>{t.hours}h</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: t.status === 'Complete' ? '#dcfce7' : '#fef9c3', color: t.status === 'Complete' ? '#166534' : '#854d0e', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
