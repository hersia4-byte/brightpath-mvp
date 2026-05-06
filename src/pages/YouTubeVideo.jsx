import { useState } from 'react'

const VIDEO_ID = 'dQw4w9WgXcQ' // Replace with actual Haya House "Little Muslim" video ID

export default function YouTubeVideo({ dark }) {
  const [playing, setPlaying] = useState(false)

  const bg = dark ? '#0f0e2e' : '#f8fafc'
  const card = dark ? '#1e1b4b' : '#fff'
  const border = dark ? '#312e81' : '#e2e8f0'
  const text = dark ? '#c7d2fe' : '#475569'
  const heading = dark ? '#e0e7ff' : '#0f172a'
  const accent = '#4f46e5'
  const tagBg = dark ? '#312e81' : '#ede9fe'
  const tagText = dark ? '#a5b4fc' : '#4f46e5'

  return (
    <div style={{ padding: '32px 28px', background: bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.47 4.83 4.83 0 00-4.84 0A4.83 4.83 0 017.21 6.69 4.83 4.83 0 004.41 10a4.83 4.83 0 00.8 3.69 4.83 4.83 0 000 5.62A4.83 4.83 0 008 21.31a4.83 4.83 0 003.77 2.47 4.83 4.83 0 004.84 0A4.83 4.83 0 0020 21.31a4.83 4.83 0 002.79-2 4.83 4.83 0 000-5.62A4.83 4.83 0 0019.59 6.69zM12 15.5L8 12l4-3.5 4 3.5-4 3.5z"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: heading, margin: 0 }}>
              The Little Muslim
            </h1>
            <p style={{ fontSize: 13, color: text, margin: 0 }}>Haya House Channel</p>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div style={{
        background: card, borderRadius: 16, border: `1px solid ${border}`,
        overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
              title="The Little Muslim - Haya House"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div
              onClick={() => setPlaying(true)}
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
              }}
            >
              {/* Crescent & star decorative */}
              <div style={{ position: 'absolute', top: 20, left: 24, opacity: 0.3, fontSize: 32, color: '#fff' }}>☪</div>
              <div style={{ position: 'absolute', bottom: 20, right: 32, opacity: 0.2, fontSize: 22, color: '#fff' }}>✦</div>
              <div style={{ position: 'absolute', top: 30, right: 60, opacity: 0.2, fontSize: 16, color: '#fff' }}>✦</div>

              {/* Title overlay */}
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{
                  fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  The Little Muslim
                </div>
                <div style={{ fontSize: 14, color: '#c7d2fe', marginBottom: 24 }}>
                  Haya House
                </div>
                {/* Play button */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', boxShadow: '0 4px 20px rgba(239,68,68,0.5)',
                  transition: 'transform .15s',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: '#a5b4fc' }}>
                  Click to play
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video info below player */}
        <div style={{ padding: '20px 24px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: heading, margin: '0 0 6px' }}>
            The Little Muslim — Learn, Grow & Shine!
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: text }}>Haya House</span>
            <span style={{ fontSize: 13, color: text }}>•</span>
            <span style={{ fontSize: 13, color: text }}>Islamic Education for Children</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Islamic Values', 'Children', 'Education', 'Haya House', 'Muslim Kids'].map(tag => (
              <span key={tag} style={{
                background: tagBg, color: tagText, borderRadius: 20,
                padding: '4px 12px', fontSize: 12, fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* About section */}
      <div style={{
        background: card, borderRadius: 16, border: `1px solid ${border}`,
        padding: '24px', marginBottom: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: heading, margin: '0 0 12px' }}>
          About This Video
        </h3>
        <p style={{ fontSize: 14, color: text, lineHeight: 1.7, margin: 0 }}>
          Join the Haya House channel on a heartwarming journey with <strong style={{ color: heading }}>The Little Muslim</strong> —
          a beautifully crafted series designed to teach young children about Islamic values, manners, and the joy of faith.
          Through colorful storytelling and age-appropriate lessons, children learn about prayer, kindness, honesty,
          gratitude, and love for Allah and family.
        </p>
      </div>

      {/* Channel info */}
      <div style={{
        background: card, borderRadius: 16, border: `1px solid ${border}`,
        padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: heading, margin: '0 0 16px' }}>
          About Haya House
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            ☪
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: heading, marginBottom: 4 }}>
              Haya House
            </div>
            <p style={{ fontSize: 13, color: text, lineHeight: 1.6, margin: '0 0 12px' }}>
              Haya House creates wholesome, faith-based content for Muslim children and families.
              Our mission is to nurture the next generation with authentic Islamic education delivered
              through engaging, child-friendly media.
            </p>
            <a
              href="https://www.youtube.com/@HayaHouse"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#ef4444', color: '#fff', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.47 4.83 4.83 0 00-4.84 0A4.83 4.83 0 017.21 6.69 4.83 4.83 0 004.41 10a4.83 4.83 0 00.8 3.69 4.83 4.83 0 000 5.62A4.83 4.83 0 008 21.31a4.83 4.83 0 003.77 2.47 4.83 4.83 0 004.84 0A4.83 4.83 0 0020 21.31a4.83 4.83 0 002.79-2 4.83 4.83 0 000-5.62A4.83 4.83 0 0019.59 6.69zM12 15.5L8 12l4-3.5 4 3.5-4 3.5z"/>
              </svg>
              Visit Haya House on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
