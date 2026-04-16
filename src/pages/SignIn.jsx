import { useState } from 'react'

export default function SignIn({ onSignIn, dark }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const bg = dark ? '#0f0e2e' : '#f8fafc'
  const cardBg = dark ? '#1e1b4b' : '#fff'
  const border = dark ? '#312e81' : '#e2e8f0'
  const text = dark ? '#c7d2fe' : '#475569'
  const heading = dark ? '#e0e7ff' : '#0f172a'
  const inputBg = dark ? '#13113a' : '#f8fafc'

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      onSignIn({ email })
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 26,
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(79,70,229,.35)',
          }}>B</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: '#4f46e5', letterSpacing: '-0.5px' }}>BrightPath</div>
          <div style={{ fontSize: 13, color: text, marginTop: 3 }}>Childcare Management Platform</div>
        </div>

        {/* Card */}
        <div style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: dark ? 'none' : '0 4px 32px rgba(79,70,229,.10)',
        }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: heading }}>Welcome back</h2>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: text }}>Sign in to your BrightPath account</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: text, marginBottom: 7 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@brightpath.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '11px 14px',
                  border: `1.5px solid ${border}`,
                  borderRadius: 10, fontSize: 14,
                  outline: 'none',
                  background: inputBg,
                  color: heading,
                  boxSizing: 'border-box',
                  transition: 'border-color .15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#4f46e5' }}
                onBlur={e => { e.target.style.borderColor = border }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: text }}>Password</label>
                <span style={{ fontSize: 12, color: '#4f46e5', cursor: 'pointer', fontWeight: 500 }}>
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '11px 14px',
                  border: `1.5px solid ${border}`,
                  borderRadius: 10, fontSize: 14,
                  outline: 'none',
                  background: inputBg,
                  color: heading,
                  boxSizing: 'border-box',
                  transition: 'border-color .15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#4f46e5' }}
                onBlur={e => { e.target.style.borderColor = border }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 14px',
                marginBottom: 18, fontSize: 13, color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                color: '#fff', border: 'none',
                borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.78 : 1,
                transition: 'opacity .2s',
                boxShadow: '0 4px 14px rgba(79,70,229,.4)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{
            marginTop: 24, padding: '11px 14px',
            background: dark ? '#312e81' : '#ede9fe',
            borderRadius: 10, fontSize: 12,
            color: dark ? '#a5b4fc' : '#4338ca',
            lineHeight: 1.5,
          }}>
            <strong>Demo mode:</strong> Enter any email and any password to access the platform.
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: text }}>
          Need access?{' '}
          <span style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>Contact your administrator</span>
        </p>
      </div>
    </div>
  )
}
