import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Children from './pages/Children'
import Staff from './pages/Staff'
import Billing from './pages/Billing'
import Meals from './pages/Meals'
import Compliance from './pages/Compliance'
import GpsCheckin from './pages/GpsCheckin'
import Reports from './pages/Reports'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === 'admin@brightpath.com' && password === 'demo1234') {
      onLogin()
    } else {
      setError('Invalid credentials. Try admin@brightpath.com / demo1234')
    }
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', borderRadius:'20px', padding:'48px 40px', width:'100%', maxWidth:'420px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <div style={{fontSize:'40px', marginBottom:'12px'}}>🌟</div>
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#1e293b', letterSpacing:'-0.5px'}}>BrightPath</h1>
          <p style={{color:'#64748b', fontSize:'14px', marginTop:'6px'}}>Childcare Management Platform</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'6px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brightpath.com"
              style={{width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', outline:'none', boxSizing:'border-box'}}
            />
          </div>

          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', outline:'none', boxSizing:'border-box'}}
            />
          </div>

          {error && (
            <div style={{background:'#fee2e2', color:'#991b1b', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px'}}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{width:'100%', background:'#1e40af', color:'white', border:'none', padding:'13px', borderRadius:'10px', fontSize:'15px', fontWeight:'700', cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>

        <div style={{marginTop:'20px', padding:'14px', background:'#f8faff', borderRadius:'10px', border:'1px solid #e2e8f0'}}>
          <p style={{fontSize:'12px', color:'#64748b', textAlign:'center'}}>
            Demo: <strong>admin@brightpath.com</strong> / <strong>demo1234</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',    icon: '📊' },
  { to: '/gps',        label: 'GPS Check-in', icon: '📍', badge: null, highlight: true },
  { to: '/children',   label: 'Children',     icon: '👶' },
  { to: '/staff',      label: 'Staff',        icon: '👩‍🏫' },
  { to: '/billing',    label: 'Billing',      icon: '💰', badge: 2 },
  { to: '/meals',      label: 'Meals',        icon: '🥗' },
  { to: '/compliance', label: 'Compliance',   icon: '✅', badge: 3 },
  { to: '/reports',    label: 'Reports',      icon: '📋' },
]

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="sidebar">
          <h1>🌟 BrightPath</h1>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: item.highlight && !isActive ? 'rgba(255,255,255,0.12)' : undefined,
                borderRadius: item.highlight ? '8px' : undefined,
              })}
            >
              <span>{item.icon} {item.label}</span>
              {item.badge && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div style={{marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.2)'}}>
            <button
              onClick={() => setLoggedIn(false)}
              style={{background:'rgba(255,255,255,0.1)', color:'white', border:'none', padding:'10px 14px', borderRadius:'10px', fontSize:'14px', cursor:'pointer', width:'100%', textAlign:'left'}}
            >
              🚪 Sign Out
            </button>
          </div>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/gps"        element={<GpsCheckin />} />
            <Route path="/children"   element={<Children />} />
            <Route path="/staff"      element={<Staff />} />
            <Route path="/billing"    element={<Billing />} />
            <Route path="/meals"      element={<Meals />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/reports"    element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
