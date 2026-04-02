const staff = [
  { id: 1, name: 'Jennifer Moore', role: 'Lead Teacher', room: 'Room A', status: 'Active' },
  { id: 2, name: 'Carlos Rivera', role: 'Assistant Teacher', room: 'Room B', status: 'Active' },
  { id: 3, name: 'Aisha Patel', role: 'Lead Teacher', room: 'Room C', status: 'Active' },
  { id: 4, name: 'David Kim', role: 'Aide', room: 'Room A', status: 'Active' },
  { id: 5, name: 'Rachel Green', role: 'Director', room: 'Office', status: 'Active' },
  { id: 6, name: 'Marcus Lee', role: 'Assistant Teacher', room: 'Room B', status: 'On Leave' },
]

export default function Staff() {
  return (
    <div>
      <h2 className="page-title">Staff</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Room</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.role}</td>
              <td>{s.room}</td>
              <td>
                <span className={`badge ${s.status === 'Active' ? 'green' : 'yellow'}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
