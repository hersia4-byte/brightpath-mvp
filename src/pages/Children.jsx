import { useState } from 'react'

const CHILDREN = [
  { id: 1, name: 'Amara Johnson', age: 3, dob: '2022-01-15', guardian: 'Lisa Johnson', phone: '(763) 555-0101', status: 'Active', enrolled: '2024-09-03', allergies: 'Peanuts', program: 'Full-Time' },
  { id: 2, name: 'Noah Williams', age: 4, dob: '2021-06-22', guardian: 'James Williams', phone: '(763) 555-0102', status: 'Active', enrolled: '2024-08-19', allergies: 'None', program: 'Full-Time' },
  { id: 3, name: 'Sofia Martinez', age: 2, dob: '2023-03-10', guardian: 'Maria Martinez', phone: '(763) 555-0103', status: 'Active', enrolled: '2025-01-06', allergies: 'Dairy', program: 'Part-Time' },
  { id: 4, name: 'Elijah Brown', age: 4, dob: '2021-09-05', guardian: 'David Brown', phone: '(763) 555-0104', status: 'Active', enrolled: '2024-09-03', allergies: 'None', program: 'Full-Time' },
  { id: 5, name: 'Zoe Davis', age: 3, dob: '2022-11-30', guardian: 'Sarah Davis', phone: '(763) 555-0105', status: 'Active', enrolled: '2024-11-11', allergies: 'Eggs', program: 'Full-Time' },
  { id: 6, name: 'Liam Anderson', age: 2, dob: '2023-07-18', guardian: 'Chris Anderson', phone: '(763) 555-0106', status: 'Active', enrolled: '2025-02-03', allergies: 'None', program: 'Part-Time' },
  { id: 7, name: 'Mia Thompson', age: 4, dob: '2021-04-25', guardian: 'Angela Thompson', phone: '(763) 555-0107', status: 'Active', enrolled: '2024-09-03', allergies: 'Shellfish', program: 'Full-Time' },
  { id: 8, name: 'Ethan Garcia', age: 3, dob: '2022-08-12', guardian: 'Carlos Garcia', phone: '(763) 555-0108', status: 'Waitlist', enrolled: '—', allergies: 'None', program: 'Full-Time' },
  { id: 9, name: 'Isla Robinson', age: 2, dob: '2023-02-28', guardian: 'Nicole Robinson', phone: '(763) 555-0109', status: 'Waitlist', enrolled: '—', allergies: 'Gluten', program: 'Part-Time' },
]

const AVATAR_COLORS = ['#4f46e5','#0891b2','#059669','#d97706','#dc2626','#7c3aed','#0284c7','#16a34a','#ea580c']

const EMPTY_FORM = { name: '', dob: '', guardian: '', phone: '', allergies: '', program: 'Full-Time' }

export default function Children() {
  const [children, setChildren] = useState(CHILDREN)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const active = children.filter(c => c.status === 'Active').length
  const waitlist = children.filter(c => c.status === 'Waitlist').length
  const fullTime = children.filter(c => c.program === 'Full-Time' && c.status === 'Active').length
  const partTime = children.filter(c => c.program === 'Part-Time' && c.status === 'Active').length

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.guardian.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter || c.program === filter
    return matchSearch && matchFilter
  })

  function handleAdd() {
    if (!form.name || !form.dob || !form.guardian) return
    const dob = new Date(form.dob)
    const age = Math.floor((new Date() - dob) / (365.25 * 24 * 3600 * 1000))
    const newChild = {
      id: children.length + 1,
      name: form.name,
      age,
      dob: form.dob,
      guardian: form.guardian,
      phone: form.phone,
      status: 'Active',
      enrolled: new Date().toISOString().slice(0,10),
      allergies: form.allergies || 'None',
      program: form.program,
    }
    setChildren([...children, newChild])
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Children</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Manage enrolled children and waitlist</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
        >
          + Add Child
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Enrolled', value: active, color: '#4f46e5', bg: '#ede9fe' },
          { label: 'Waitlist', value: waitlist, color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Full-Time', value: fullTime, color: '#0891b2', bg: '#e0f2fe' },
          { label: 'Part-Time', value: partTime, color: '#059669', bg: '#d1fae5' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ marginTop: 8, width: '100%', height: 4, background: k.bg, borderRadius: 4 }}>
              <div style={{ width: `${(k.value / children.length) * 100}%`, height: '100%', background: k.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Allergy Alert Banner */}
      {children.filter(c => c.allergies !== 'None' && c.status === 'Active').length > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
  #      {children.filter(c => c.allergies !== 'None' && c.status === 'Active').length} enrolled children have food allergies on file — confirm meal plans daily.
          </span>
        </div>
      )}

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or guardian..."
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }}
        />
        {['All','Active','Waitlist','Full-Time','Part-Time'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 14px', border: '1px solid', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 500,
              background: filter === f ? '#4f46e5' : '#fff',
              color: filter === f ? '#fff' : '#475569',
              borderColor: filter === f ? '#4f46e5' : '#e2e8f0',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Child','Age','Guardian','Phone','Program','Allergies','Status','Enrolled'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === c.id ? '#f0f9ff' : 'transparent', transition: 'background .15s' }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{c.age}y</td>
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{c.guardian}</td>
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: 14 }}>{c.phone}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: c.program === 'Full-Time' ? '#e0f2fe' : '#f0fdf4', color: c.program === 'Full-Time' ? '#0369a1' : '#166534', padding: '3px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.program}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {c.allergies !== 'None'
                    ? <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⚠ {c.allergies}</span>
                    : <span style={{ color: '#94a3b8', fontSize: 13 }}>None</span>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: c.status === 'Active' ? '#dcfce7' : '#fef9c3', color: c.status === 'Active' ? '#166534' : '#854d0e', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.status}</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{c.enrolled}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No children match your search.</div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '2px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>{selected.name} — Profile</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 16 }}>
            {[
              ['Date of Birth', selected.dob],
              ['Age', `${selected.age} years old`],
              ['Program', selected.program],
              ['Guardian', selected.guardian],
              ['Phone', selected.phone],
              ['Enrolled', selected.enrolled],
              ['Allergies', selected.allergies],
              ['Status', selected.status],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Add New Child</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: "Child's Full Name *", key: 'name', type: 'text', placeholder: 'First Last' },
                { label: 'Date of Birth *', key: 'dob', type: 'date' },
                { label: 'Guardian Full Name *', key: 'guardian', type: 'text', placeholder: 'Parent/Guardian' },
                { label: 'Guardian Phone', key: 'phone', type: 'tel', placeholder: '(xxx) xxx-xxxx' },
                { label: 'Known Allergies', key: 'allergies', type: 'text', placeholder: 'e.g. Peanuts, Dairy or None' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, color: '#475569', fontWeight: 500, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, color: '#475569', fontWeight: 500, display: 'block', marginBottom: 6 }}>Program</label>
                <select
                  value={form.program}
                  onChange={e => setForm({ ...form, program: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }}
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, color: '#475569' }}>Cancel</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 8, background: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Add Child</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
