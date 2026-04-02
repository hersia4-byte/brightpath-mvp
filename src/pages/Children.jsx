import { useState } from 'react'

const children = [
  { id: 1, name: 'Amina Hassan', age: 4, guardian: 'Fatima Hassan', phone: '612-555-0101' },
  { id: 2, name: 'Liam Johnson', age: 3, guardian: 'Sarah Johnson', phone: '612-555-0102' },
  { id: 3, name: 'Sofia Martinez', age: 5, guardian: 'Maria Martinez', phone: '612-555-0103' },
  { id: 4, name: 'Noah Williams', age: 4, guardian: 'James Williams', phone: '612-555-0104' },
  { id: 5, name: 'Zara Ahmed', age: 3, guardian: 'Omar Ahmed', phone: '612-555-0105' },
]

export default function Children() {
  const [gpsStatus, setGpsStatus] = useState('')

  const handleCheckin = () => {
    setGpsStatus('Locating...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsStatus(`✅ Check-in confirmed at ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
      },
      () => {
        setGpsStatus('❌ Location access denied')
      }
    )
  }

  return (
    <div>
      <h2 className="page-title">Children</h2>
      <button className="btn" onClick={handleCheckin}>📍 GPS Check-in</button>
      {gpsStatus && <p style={{marginBottom: '16px', color: '#276749'}}>{gpsStatus}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Guardian</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {children.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.age}</td>
              <td>{c.guardian}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
