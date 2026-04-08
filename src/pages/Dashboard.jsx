import { useEffect, useRef } from 'react'

const weeklyData = [
  { day: 'Mon', present: 20, absent: 4 },
  { day: 'Tue', present: 22, absent: 2 },
  { day: 'Wed', present: 19, absent: 5 },
  { day: 'Thu', present: 23, absent: 1 },
  { day: 'Fri', present: 18, absent: 6 },
]

function BarChart({ data }) {
  const max = 24
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '160px', padding: '0 8px' }}>
      {data.map((d) => (
        <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'flex-end', height: '130px' }}>
            <div style={{ width: '100%', height: `${(d.absent / max) * 130}px`, background: '#fee2e2', borderRadius: '4px 4px 0 0' }} title={`Absent: ${d.absent}`} />
            <div style={{ width: '100%', height: `${(d.present / max) * 130}px`, background: '#1e40af', borderRadius: '4px 4px 0 0' }} title={`Present: ${d.present}`} />
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Welcome back — here's what's happening today</p>

      <div className="cards">
        <div className="card">
          <div className="card-icon">👶</div>
          <h3>Total Children</h3>
          <p>24</p>
        </div>
        <div className="card">
          <div className="card-icon">👩‍🏫</div>
          <h3>Staff Members</h3>
          <p>8</p>
        </div>
        <div className="card">
          <div className="card-icon">✅</div>
          <h3>Present Today</h3>
          <p>18</p>
        </div>
        <div className="card">
          <div className="card-icon">❌</div>
          <h3>Absent Today</h3>
          <p>6</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', minWidth: '300px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px', color: '#1e293b' }}>Weekly Attendance</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Mon–Fri this week</p>
          <BarChart data={weeklyData} />
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#1e40af', borderRadius: '3px' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>Present</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#fee2e2', borderRadius: '3px' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>Absent</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', minWidth: '200px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px', color: '#1e293b' }}>Today's Summary</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>April 8, 2026</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Attendance Rate', value: '75%', color: '#1e40af' },
              { label: 'Meals Served', value: '22', color: '#16a34a' },
              { label: 'Compliance', value: '87%', color: '#d97706' },
              { label: 'Billing Collected', value: '$3,200', color: '#7c3aed' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Age</th>
              <th>Status</th>
              <th>Check-in Time</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Amina Hassan</td><td>4</td><td><span className="badge green">Present</span></td><td>8:02 AM</td></tr>
            <tr><td>Liam Johnson</td><td>3</td><td><span className="badge green">Present</span></td><td>8:15 AM</td></tr>
            <tr><td>Sofia Martinez</td><td>5</td><td><span className="badge red">Absent</span></td><td>—</td></tr>
            <tr><td>Noah Williams</td><td>4</td><td><span className="badge green">Present</span></td><td>8:30 AM</td></tr>
            <tr><td>Zara Ahmed</td><td>3</td><td><span className="badge green">Present</span></td><td>8:45 AM</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
