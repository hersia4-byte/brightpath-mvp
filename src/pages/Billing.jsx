import { useState } from 'react'

const INVOICES = [
  { id: 'INV-001', child: 'Amara Johnson', guardian: 'Lisa Johnson', program: 'Full-Time', amount: 1200, due: '2026-04-01', paid: '2026-03-28', status: 'Paid', method: 'ACH' },
  { id: 'INV-002', child: 'Noah Williams', guardian: 'James Williams', program: 'Full-Time', amount: 1200, due: '2026-04-01', paid: null, status: 'Pending', method: null },
  { id: 'INV-003', child: 'Sofia Martinez', guardian: 'Maria Martinez', program: 'Part-Time', amount: 700, due: '2026-04-01', paid: null, status: 'Overdue', method: null },
  { id: 'INV-004', child: 'Elijah Brown', guardian: 'David Brown', program: 'Full-Time', amount: 1200, due: '2026-04-01', paid: '2026-04-01', status: 'Paid', method: 'Card' },
  { id: 'INV-005', child: 'Zoe Davis', guardian: 'Sarah Davis', program: 'Full-Time', amount: 1200, due: '2026-04-01', paid: '2026-03-30', status: 'Paid', method: 'ACH' },
  { id: 'INV-006', child: 'Liam Anderson', guardian: 'Chris Anderson', program: 'Part-Time', amount: 700, due: '2026-04-01', paid: null, status: 'Pending', method: null },
  { id: 'INV-007', child: 'Mia Thompson', guardian: 'Angela Thompson', program: 'Full-Time', amount: 1200, due: '2026-04-01', paid: '2026-04-02', status: 'Paid', method: 'Check' },
  { id: 'INV-008', child: 'Amara Johnson', guardian: 'Lisa Johnson', program: 'Full-Time', amount: 1200, due: '2026-03-01', paid: '2026-02-27', status: 'Paid', method: 'ACH' },
  { id: 'INV-009', child: 'Noah Williams', guardian: 'James Williams', program: 'Full-Time', amount: 1200, due: '2026-03-01', paid: '2026-03-03', status: 'Paid', method: 'Card' },
  { id: 'INV-010', child: 'Sofia Martinez', guardian: 'Maria Martinez', program: 'Part-Time', amount: 700, due: '2026-03-01', paid: '2026-03-01', status: 'Paid', method: 'ACH' },
]

const REVENUE_MONTHS = [
  { month: 'Nov', revenue: 6100 },
  { month: 'Dec', revenue: 5800 },
  { month: 'Jan', revenue: 7200 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 7400 },
  { month: 'Apr', revenue: 5600 },
]

const STATUS_STYLE = {
  Paid: { bg: '#dcfce7', color: '#166534' },
  Pending: { bg: '#fef9c3', color: '#854d0e' },
  Overdue: { bg: '#fee2e2', color: '#dc2626' },
}

export default function Billing() {
  const [invoices, setInvoices] = useState(INVOICES)
  const [filter, setFilter] = useState('All')
  const [markingId, setMarkingId] = useState(null)

  const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0)
  const collectionRate = Math.round((totalCollected / (totalCollected + totalPending + totalOverdue)) * 100)

  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter)

  const maxRev = Math.max(...REVENUE_MONTHS.map(m => m.revenue))

  function markPaid(id) {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, status: 'Paid', paid: new Date().toISOString().slice(0, 10), method: 'Manual' } : inv
    ))
    setMarkingId(null)
  }

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Billing</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Invoices, payments & revenue tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 16px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>
            Export CSV
          </button>
          <button style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            + New Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Collected (Apr)', value: `$${totalCollected.toLocaleString()}`, color: '#059669', bg: '#d1fae5', icon: '💰' },
          { label: 'Pending', value: `$${totalPending.toLocaleString()}`, color: '#d97706', bg: '#fef3c7', icon: '⏳' },
          { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, color: '#dc2626', bg: '#fee2e2', icon: '🚨' },
          { label: 'Collection Rate', value: `${collectionRate}%`, color: '#4f46e5', bg: '#ede9fe', icon: '📈' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
              <div style={{ fontSize: 28 }}>{k.icon}</div>
            </div>
            <div style={{ marginTop: 12, background: k.bg, borderRadius: 6, height: 6 }}>
              <div style={{ width: `${Math.min(100, (parseFloat(k.value.replace(/[^0-9.]/g, '')) / 10000) * 100)}%`, height: '100%', background: k.color, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Overdue Alert */}
      {totalOverdue > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🚨</span>
            <span style={{ fontSize: 13, color: '#7f1d1d', fontWeight: 500 }}>
              ${totalOverdue.toLocaleString()} overdue — {invoices.filter(i => i.status === 'Overdue').length} invoice(s) past due. Send payment reminder?
            </span>
          </div>
          <button style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Send Reminder
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Invoice Table */}
        <div>
          {/* Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px', border: '1px solid', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500,
                  background: filter === f ? '#4f46e5' : '#fff',
                  color: filter === f ? '#fff' : '#475569',
                  borderColor: filter === f ? '#4f46e5' : '#e2e8f0',
                }}
              >{f}</button>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Invoice','Child','Program','Amount','Due','Status','Action'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const st = STATUS_STYLE[inv.status]
                  return (
                    <tr key={inv.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>{inv.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{inv.child}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{inv.guardian}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{inv.program}</td>
                      <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>${inv.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>{inv.due}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: st.bg, color: st.color, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{inv.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {inv.status !== 'Paid'
                          ? <button onClick={() => markPaid(inv.id)} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Mark Paid</button>
                          : <span style={{ fontSize: 12, color: '#94a3b8' }}>{inv.method}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Monthly Revenue</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
              {REVENUE_MONTHS.map(m => {
                const h = (m.revenue / maxRev) * 140
                const isCurrent = m.month === 'Apr'
                return (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>${(m.revenue / 1000).toFixed(1)}k</div>
                    <div style={{ width: '100%', height: h, background: isCurrent ? '#4f46e5' : '#e0e7ff', borderRadius: '4px 4px 0 0', transition: 'height .5s' }} />
                    <div style={{ fontSize: 11, color: isCurrent ? '#4f46e5' : '#94a3b8', fontWeight: isCurrent ? 700 : 400 }}>{m.month}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>Monthly Target</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>$7,600</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>Apr Collected</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>${totalCollected.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>Remaining</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#d97706' }}>${(7600 - totalCollected).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rate Card */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginTop: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Rate Schedule</h3>
            {[
              { program: 'Full-Time', rate: '$1,200/mo', slots: '5 enrolled' },
              { program: 'Part-Time', rate: '$700/mo', slots: '2 enrolled' },
              { program: 'Drop-In', rate: '$75/day', slots: 'As available' },
            ].map(r => (
              <div key={r.program} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.program}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.slots}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4f46e5' }}>{r.rate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
