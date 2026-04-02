const meals = [
  { id: 1, time: 'Breakfast', menu: 'Oatmeal, fruit, milk', served: 22, date: 'Today' },
  { id: 2, time: 'Morning Snack', menu: 'Crackers, apple slices', served: 22, date: 'Today' },
  { id: 3, time: 'Lunch', menu: 'Chicken, rice, vegetables, milk', served: 20, date: 'Today' },
  { id: 4, time: 'Afternoon Snack', menu: 'Yogurt, banana', served: 18, date: 'Today' },
]

export default function Meals() {
  return (
    <div>
      <h2 className="page-title">Meals Log</h2>
      <div className="cards">
        <div className="card">
          <h3>Meals Today</h3>
          <p>{meals.length}</p>
        </div>
        <div className="card">
          <h3>Children Served</h3>
          <p>22</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Meal</th>
            <th>Menu</th>
            <th>Children Served</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {meals.map(m => (
            <tr key={m.id}>
              <td>{m.time}</td>
              <td>{m.menu}</td>
              <td>{m.served}</td>
              <td>{m.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
