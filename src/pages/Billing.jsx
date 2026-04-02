const billing = [
  { id: 1, name: 'Amina Hassan', plan: 'Full Time', fee: 1200, status: 'Paid' },
  { id: 2, name: 'Liam Johnson', plan: 'Part Time', fee: 800, status: 'Paid' },
  { id: 3, name: 'Sofia Martinez', plan: 'Full Time', fee: 1200, status: 'Unpaid' },
  { id: 4, name: 'Noah Williams', plan: 'Full Time', fee: 1200, status: 'Paid' },
  { id: 5, name: 'Zara Ahmed', plan: 'Part Time', fee: 800, status: 'Unpaid' },
]

export default function Billing() {
  const total = billing.reduce((sum, b) => sum + b.fee, 0)
  const collected = billing.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.fee, 0)

  return (
    <div>
      <h2 className="page-title">Billing</h2>
      <div className="cards">
        <div className="card">
          <h3>Total Monthly</h3>
          <p>${total.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Collected</h3>
          <p>${collected.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Outstanding</h3>
          <p>${(total - collected).toLocaleString()}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Child</th>
            <th>Plan</th>
            <th>Monthly Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {billing.map(b => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.plan}</td>
              <td>${b.fee.toLocaleString()}</td>
              <td>
                <span className={`badge ${b.status === 'Paid' ? 'green' : 'red'}`}>
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
