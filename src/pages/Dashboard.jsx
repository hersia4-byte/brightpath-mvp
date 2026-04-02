export default function Dashboard() {
  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="cards">
        <div className="card">
          <h3>Total Children</h3>
          <p>24</p>
        </div>
        <div className="card">
          <h3>Staff Members</h3>
          <p>8</p>
        </div>
        <div className="card">
          <h3>Present Today</h3>
          <p>18</p>
        </div>
        <div className="card">
          <h3>Absent Today</h3>
          <p>6</p>
        </div>
      </div>
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
  )
}
