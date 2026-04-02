import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Children from './pages/Children'
import Staff from './pages/Staff'
import Billing from './pages/Billing'
import Meals from './pages/Meals'
import Compliance from './pages/Compliance'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="sidebar">
          <h1>🌟 BrightPath</h1>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/children">Children</NavLink>
          <NavLink to="/staff">Staff</NavLink>
          <NavLink to="/billing">Billing</NavLink>
          <NavLink to="/meals">Meals</NavLink>
          <NavLink to="/compliance">Compliance</NavLink>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/children" element={<Children />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/compliance" element={<Compliance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
