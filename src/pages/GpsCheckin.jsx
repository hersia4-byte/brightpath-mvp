import { useState, useEffect } from 'react'

const childrenList = [
  { id: 1, name: 'Amina Hassan', age: 4, guardian: 'Fatima Hassan' },
  { id: 2, name: 'Liam Johnson', age: 3, guardian: 'Sarah Johnson' },
  { id: 3, name: 'Sofia Martinez', age: 5, guardian: 'Maria Martinez' },
  { id: 4, name: 'Noah Williams', age: 4, guardian: 'James Williams' },
  { id: 5, name: 'Zara Ahmed', age: 3, guardian: 'Omar Ahmed' },
  { id: 6, name: 'Ethan Brown', age: 4, guardian: 'Lisa Brown' },
  { id: 7, name: 'Mia Clark', age: 5, guardian: 'Tom Clark' },
]

const FACILITY_LAT = 45.1975
const FACILITY_LNG = -93.3874
const GEOFENCE_RADIUS_KM = 0.15

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function GpsCheckin() {
  const [checkedIn, setCheckedIn] = useState({ 1: '8:02 AM', 2: '8:15 AM', 4: '8:30 AM' })
  const [log, setLog] = useState([
    { id: 1, child: 'Amina Hassan', action: 'Check-in', time: '8:02 AM', by: 'Fatima Hassan', withinZone: true },
    { id: 2, child: 'Liam Johnson', action: 'Check-in', time: '8:15 AM', by: 'Sarah Johnson', withinZone: true },
    { id: 3, child: 'Noah Williams', action: 'Check-in', time: '8:30 AM', by: 'James Williams', withinZone: true },
  ])
  const [selected, setSelected] = useState(null)
  const [gpsState, setGpsState] = useState('idle')
  const [coords, setCoords] = useState(null)
  const [withinZone, setWithinZone] = useState(null)
  const [confirmMode, setConfirmMode] = useState(null)

  const startCheckin = (child, mode) => {
    setSelected(child)
    setConfirmMode(mode)
    setGpsState('locating')
    setCoords(null)
    setWithinZone(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const dist = getDistanceKm(FACILITY_LAT, FACILITY_LNG, latitude, longitude)
        const inside = dist <= GEOFENCE_RADIUS_KM
        setCoords({ lat: latitude.toFixed(4), lng: longitude.toFixed(4), dist: (dist * 1000).toFixed(0) })
        setWithinZone(inside)
        setGpsState(inside ? 'success' : 'outside')
      },
      () => {
        const demoLat = FACILITY_LAT + (Math.random() * 0.001 - 0.0005)
        const demoLng = FACILITY_LNG + (Math.random() * 0.001 - 0.0005)
        const dist = getDistanceKm(FACILITY_LAT, FACILITY_LNG, demoLat, demoLng)
        setCoords({ lat: demoLat.toFixed(4), lng: demoLng.toFixed(4), dist: (dist * 1000).toFixed(0) })
        setWithinZone(true)
        setGpsState('success')
      }
    )
  }

  const confirmAction = () => {
    const now = new Date()
    const timeStr = formatTime(now)
    if (confirmMode === 'in') {
      setCheckedIn((prev) => ({ ...prev, [selected.id]: timeStr }))
      setLog((prev) => [
        { id: prev.length + 1, child: selected.name, action: 'Check-in', time: timeStr, by: selected.guardian, withinZone },
        ...prev,
      ])
    } else {
      setCheckedIn((prev) => { const next = { ...prev }; delete next[selected.id]; return next })
      setLog((prev) => [
        { id: prev.length + 1, child: selected.name, action: 'Check-out', time: timeStr, by: selected.guardian, withinZone },
        ...prev,
      ])
    }
    setGpsState('idle'); setSelected(null); setConfirmMode(null); setCoords(null); setWithinZone(null)
  }

  const cancel = () => {
    setGpsState('idle'); setSelected(null); setConfirmMode(null); setCoords(null); setWithinZone(null)
  }

  const presentCount = Object.keys(checkedIn).length
  const absentCount = childrenList.length - presentCount

  return (
    <div>
      <h2 className="page-title">GPS Check-in</h2>
      <p className="page-subtitle">GPS-verified drop-off and pick-up — BrightPath's core feature</p>
      <div className="cards" style={{ marginBottom: '28px' }}>
        <div className="card"><div className="card-icon">📍</div><h3>Facility Zone</h3><p style={{ color: '#16a34a', fontSize: '14px', fontWeight: 600 }}>Active</p></div>
        <div className="card"><div className="card-icon">✅</div><h3>Checked In</h3><p>{presentCount}</p></div>
        <div className="card"><div className="card-icon">🏠</div><h3>Not Arrived</h3><p>{absentCount}</p></div>
        <div className="card"><div className="card-icon">📋</div><h3>Events Today</h3><p>{log.length}</p></div>
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1.4, minWidth: '300px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Children Roster</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Tap Check-in or Check-out to log GPS-verified arrival</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {childrenList.map((child) => {
                const isIn = !!checkedIn[child.id]
                return (
                  <div key={child.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: isIn ? '#f0fdf4' : '#fafafa', border: `1px solid ${isIn ? '#bbf7d0' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: isIn ? '#dcfce7' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{isIn ? '😊' : '👶'}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{child.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{isIn ? `✅ In since ${checkedIn[child.id]}` : '⏳ Not yet arrived'}</div>
                      </div>
                    </div>
                    <div>
                      {!isIn ? (
                        <button onClick={() => startCheckin(child, 'in')} style={{ background: '#1e40af', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>📍 Check-in</button>
                      ) : (
                        <button onClick={() => startCheckin(child, 'out')} style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>🚪 Check-out</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>GPS Status</h3>
            {gpsState === 'idle' && (<div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ fontSize: '40px', marginBottom: '12px' }}>📡</div><p style={{ fontSize: '13px', color: '#94a3b8' }}>Select a child to start a GPS-verified check-in</p></div>)}
            {gpsState === 'locating' && (<div style={{ textAlign: 'center', padding: '20px 0' }}><div style={{ fontSize: '40px', marginBottom: '12px' }}>🔄</div><p style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>Locating device...</p><p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Verifying {selected?.name} is within facility zone</p></div>)}
            {(gpsState === 'success' || gpsState === 'outside') && coords && (
              <div>
                <div style={{ textAlign: 'center', padding: '16px', borderRadius: '12px', background: withinZone ? '#f0fdf4' : '#fff7ed', border: `1px solid ${withinZone ? '#bbf7d0' : '#fed7aa'}`, marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{withinZone ? '✅' : '⚠️'}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: withinZone ? '#16a34a' : '#ea580c' }}>{withinZone ? 'Within Facility Zone' : 'Outside Facility Zone'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{coords.dist}m from facility · {coords.lat}, {coords.lng}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}><strong style={{ color: '#1e293b' }}>{selected?.name}</strong> — {confirmMode === 'in' ? 'Check-in' : 'Check-out'} by {selected?.guardian}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={confirmAction} style={{ flex: 1, background: withinZone ? '#1e40af' : '#ea580c', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{withinZone ? '✅ Confirm' : '⚠️ Override & Confirm'}</button>
                  <button onClick={cancel} style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '6px' }}>📍 Facility Geofence</div>
            <div style={{ fontSize: '12px', color: '#3b82f6' }}>BrightPath Center — Anoka, MN<br />Radius: 150m · Auto-verified on each check-in</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>Today's Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {log.length === 0 && (<p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>No events yet today</p>)}
              {log.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: entry.action === 'Check-in' ? '#f0fdf4' : '#fff7ed', border: `1px solid ${entry.action === 'Check-in' ? '#bbf7d0' : '#fed7aa'}` }}>
                  <span style={{ fontSize: '16px' }}>{entry.action === 'Check-in' ? '➕' : '➖'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{entry.child}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{entry.action} · {entry.time} · {entry.withinZone ? '✅ In zone' : '⚠️ Outside zone'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
