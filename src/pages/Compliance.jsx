import { useState } from 'react'

const initialItems = [
  { id: 1, item: 'Fire extinguisher inspected', category: 'Safety', done: true },
  { id: 2, item: 'First aid kit stocked', category: 'Safety', done: true },
  { id: 3, item: 'Staff background checks current', category: 'Staffing', done: true },
  { id: 4, item: 'Child-to-staff ratios met', category: 'Staffing', done: true },
  { id: 5, item: 'Emergency contact forms on file', category: 'Records', done: false },
  { id: 6, item: 'Immunization records updated', category: 'Records', done: false },
  { id: 7, item: 'Monthly fire drill completed', category: 'Safety', done: true },
  { id: 8, item: 'Incident report log current', category: 'Records', done: false },
]

export default function Compliance() {
  const [items, setItems] = useState(initialItems)

  const toggle = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const completed = items.filter(i => i.done).length

  return (
    <div>
      <h2 className="page-title">Compliance Checklist</h2>
      <div className="cards">
        <div className="card">
          <h3>Completed</h3>
          <p>{completed}/{items.length}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p>{items.length - completed}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} onClick={() => toggle(i.id)} style={{cursor: 'pointer'}}>
              <td>{i.item}</td>
              <td>{i.category}</td>
              <td>
                <span className={`badge ${i.done ? 'green' : 'red'}`}>
                  {i.done ? '✅ Done' : '⏳ Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
