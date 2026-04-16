import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import GpsCheckin from './pages/GpsCheckin'
import Children from './pages/Children'
import Staff from './pages/Staff'
import Billing from './pages/Billing'
import Meals from './pages/Meals'
import Compliance from './pages/Compliance'
import Reports from './pages/Reports'

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',    icon: 'dashboard' },
  { to: '/gps',        label: 'GPS Check-in', icon: 'gps',        highlight: true },
  { to: '/children',   label: 'Children',     icon: 'children' },
  { to: '/staff',      label: 'Staff',        icon: 'staff' },
  { to: '/billing',    label: 'Billing',      icon: 'billing',    badge: 2 },
  { to: '/meals',      label: 'Meals',        icon: 'meals' },
  { to: '/compliance', label: 'Compliance',   icon: 'compliance', badge: 3 },
  { to: '/reports',    label: 'Reports',      icon: 'reports' },
]

const ICONS = {
  dashboard:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  gps:        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>,
  children:   <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="18" cy="9" r="3"/><path d="M21 21v-1a3 3 0 00-3-3h-1"/></svg>,
  staff:      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a8 8 0 0116 0v2"/></svg>,
  billing:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  meals:      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  compliance: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  reports:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
}

function Sidebar({ dark, setDark, mobileOpen, setMobileOpen }) {
  const location = useLocation()

  const bg = dark ? '#1e1b4b' : '#fff'
  const text = dark ? '#c7d2fe' : '#475569'
  const activeBg = dark ? '#312e81' : '#ede9fe'
  const activeText = dark ? '#a5b4fc' : '#4f46e5'
  const border = dark ? '#312e81' : '#f1f5f9'
  const logoText = dark ? '#a5b4fc' : '#4f46e5'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40, display: 'none' }}
          className="mobile-overlay"
        />
      )}
      <nav style={{
        width: 220, flexShrink: 0, background: bg, borderRight: `1px solid ${border}`,
        display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0,
        transition: 'background .2s',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>B</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: logoText }}>BrightPath</div>
              <div style={{ fontSize: 10, color: text, marginTop: -1 }}>Childcare Manager</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                  marginBottom: 2, textDecoration: 'none', position: 'relative',
                  background: isActive ? activeBg : (item.highlight && !isActive ? (dark ? '#2d2560' : '#f5f3ff') : 'transparent'),
                  color: isActive ? activeText : (item.highlight ? (dark ? '#818cf8' : '#6d28d9') : text),
                  fontWeight: isActive ? 700 : 500, fontSize: 14,
                  transition: 'background .15s, color .15s',
                }}
              >
                <span style={{ color: isActive ? activeText : (item.highlight ? (dark ? '#818cf8' : '#6d28d9') : text) }}>
                  {ICONS[item.icon]}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: '#dc2626', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Bottom: dark mode + profile */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${border}` }}>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: dark ? '#312e81' : '#f8fafc', cursor: 'pointer', marginBottom: 8 }}
          >
            <span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}|/span>
            <span style={{ fontSize: 14, color: text, fontWeight: 500 }}>{dark ? 'Light Mode' : 'Dark Mode'}</span>
            <div style={{ marginLeft: 'auto', width: 36, height: 20, background: dark ? '#4f46e5' : '#e2e8f0', borderRadius: 10, position: 'relative', transition: 'background .2s' }}>
              <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: dark ? 18 : 2, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
          </button>
          {/* Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: dark ? '#312e81' : '#f8fafc' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>T</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: dark ? '#e0e7ff' : '#0f172a' }}>Tom Lindqvist</div>
              <div style={{ fontSize: 11, color: text }}>Director</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function Layout({ children, dark, setDark }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainBg = dark ? '#0f0e2e' : '#f8fafc'
  const headerBg = dark ? '#1e1b4b' : '#fff'
  const headerBorder = dark ? '#312e81' : '#f1f5f9'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg }}>
      {/* Mobile hamburger header */}
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: headerBg, borderBottom: `1px solid ${headerBorder}`, alignItems: 'center', padding: '0 16px', zIndex: 30 }}>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
        <span style={{ marginLeft: 12, fontWeight: 700, color: '#4f46e5' }}>BrightPath</span>
      </div>

      <Sidebar dark={dark} setDark={setDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main style={{ flex: 1, overflowY: 'auto', transition: 'background .2s' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)

  return (
    <BrowserRouter>
      <Layout dark={dark} setDark={setDark}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gps" element={<GpsCheckin />} />
          <Route path="/children" element={<Children />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
