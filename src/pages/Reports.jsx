import { useState } from 'react'

const attendanceData = [
  { week: 'Mar 24', present: 19, absent: 5, rate: 79 },
  { week: 'Mar 31', present: 21, absent: 3, rate: 88 },
  { week: 'Apr 7', present: 18, absent: 6, rate: 75 },
  { week: 'Apr 14', present: 22, absent: 2, rate: 92 },
]

const billingData = [
  { month: 'January', collected: 4800, outstanding: 1200, total: 6000 },
  { month: 'February', collected: 5400, outstanding: 600, total: 6000 },
  { month: 'March', collected: 5200, outstanding: 800, total: 6000 },
  { month: 'April', collected: 3200, outstanding: 2800, total: 6000 },
]

const complianceData = [
  { category: 'Safety', completed: 3, total: 3 },
  { category: 'Staffing', completed: 2, total: 2 },
  { category: 'Records', completed: 0, total: 3 },
]

const dailyCheckins = [
  { date: 'Mon Apr 14', checkins: 22, checkouts: 22, avgTime: '8:18 AM' },
  { date: 'Tue Apr 15', checkins: 20, checkouts: 18, avgTime: '8:22 AM' },
  { date: 'Wed Apr 9', checkins: 19, checkouts: 19, avgTime: '8:31 AM' },
  { date: 'Thu Apr 10', checkins: 23, checkouts: 23, avgTime: '8:09 AM' },
  { date: 'Fri Apr 11', checkins: 18, checkouts: 18, avgTime: '8:44 AM' },
]

const TABS = ['Attendance', 'Billing', 'Compliance', 'GPS Check-ins']

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Attendance')
  const maxBar = 24

  return (
    <div>
      <h2 className="page-title">Reports</h2>
      <p className="page-subtitle">Weekly and monthly summaries across all BrightPath modules</p>

      {/* Summary KPIs */}
      <div className="cards" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-icon">📊</div>
          <h3>Avg Attendance</h3>
          <p>83.5%</p>
        </div>
        <div className="card">
          <div className="card-icon">💰</div>
          <h3>Monthly Revenue</h3>
          <p>$6,000</p>
        </div>
        <div className="card">
          <div className="card-icon">✅</div>
          <h3>Compliance</h3>
          <p>62%</p>
        </div>
        <div className="card">
          <div className="card-icon">📍</div>
          <h3>GPS Check-ins</h3>
          <p>102</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeTab === tab ? 'none' : '1px solid #e2e8f0',
              background: activeTab === tab ? '#1e40af' : 'white',
              color: activeTab === tab ? 'white' : '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === 'Attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Weekly Attendance (Last 4 Weeks)</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>Present vs Absent per week</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '160px' }}>
              {attendanceData.map((d) => (
                <div key={d.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af' }}>{d.rate}%</div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px', height: '120px', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${(d.absent / maxBar) * 120}px`, background: '#fca5a5', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ width: '100%', height: `${(d.present / maxBar) * 120}px`, background: '#1e40af', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{d.week}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#1e40af', borderRadius: '3px' }} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>Present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#fca5a5', borderRadius: '3px' }} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>Absent</span>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Week Of</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((d) => (
                  <tr key={d.week}>
                    <td>{d.week}</td>
                    <td>{d.present}</td>
                    <td>{d.absent}</td>
                    <td>
                      <span className={`badge ${d.rate >= 85 ? 'green' : d.rate >= 75 ? 'yellow' : 'red'}`}>
                        {d.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'Billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Monthly Billing Summary</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>Collected vs outstanding per month</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {billingData.map((d) => {
                const pct = Math.round((d.collected / d.total) * 100)
                return (
                  <div key={d.month}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{d.month}</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>${d.collected.toLocaleString()} / ${d.total.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : pct >= 80 ? '#1e40af' : '#ea580c', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{pct}% collected · ${d.outstanding.toLocaleString()} outstanding</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Billed</th>
                  <th>Collected</th>
                  <th>Outstanding</th>
                  <th>Collection Rate</th>
                </tr>
              </thead>
              <tbody>
                {billingData.map((d) => (
                  <tr key={d.month}>
                    <td>{d.month}</td>
                    <td>${d.total.toLocaleString()}</td>
                    <td style={{ color: '#16a34a', fontWeight: 600 }}>${d.collected.toLocaleString()}</td>
                    <td style={{ color: d.outstanding > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                      {d.outstanding > 0 ? `$${d.outstanding.toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${d.collected === d.total ? 'green' : d.collected / d.total >= 0.8 ? 'yellow' : 'red'}`}>
                        {Math.round((d.collected / d.total) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'Compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {complianceData.map((c) => {
              const pct = Math.round((c.completed / c.total) * 100)
              return (
                <div key={c.category} style={{ flex: 1, minWidth: '180px', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>{c.category}</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: pct === 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#dc2626', marginBottom: '8px' }}>
                    {c.completed}/{c.total}
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#dc2626', borderRadius: '999px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{pct}% complete</div>
                </div>
              )
            })}
          </div>

          <div style={{ background: '#fefce8', borderRadius: '12px', padding: '16px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '6px' }}>⚠️ Action Required</div>
            <div style={{ fontSize: '12px', color: '#78350f' }}>
              3 Records items are incomplete: Emergency contact forms, Immunization records, and Incident report log. These must be completed before your next DCYF inspection.
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Items Completed</th>
                  <th>Items Pending</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.map((c) => (
                  <tr key={c.category}>
                    <td>{c.category}</td>
                    <td>{c.completed}</td>
                    <td>{c.total - c.completed}</td>
                    <td>
                      <span className={`badge ${c.completed === c.total ? 'green' : c.completed > 0 ? 'yellow' : 'red'}`}>
                        {c.completed === c.total ? '✅ Complete' : c.completed > 0 ? '⚠️ In Progress' : '❌ Not Started'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GPS Check-ins Tab */}
      {activeTab === 'GPS Check-ins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>📍 GPS Verification Rate</div>
            <div style={{ fontSize: '12px', color: '#3b82f6' }}>
              100% of check-ins this week were GPS-verified and within the facility geofence. No overrides recorded.
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-ins</th>
                  <th>Check-outs</th>
                  <th>Avg Arrival Time</th>
                  <th>GPS Verified</th>
                </tr>
              </thead>
              <tbody>
                {dailyCheckins.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.checkins}</td>
                    <td>{d.checkouts}</td>
                    <td>{d.avgTime}</td>
                    <td><span className="badge green">✅ 100%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Row */}
      <div style={{ marginTop: '28px', padding: '16px 20px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Export this report for licensing, DCYF compliance, or parent communication</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            📄 Export PDF
          </button>
          <button style={{ background: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            📊 Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
