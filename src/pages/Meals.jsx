import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TODAY = 'Wednesday'

const MEAL_PLAN = {
  Monday:    { breakfast: 'Oatmeal w/ Berries, Milk', lunch: 'Turkey Sandwich, Carrots, Apple', snack: 'Goldfish Crackers, Apple Juice' },
  Tuesday:   { breakfast: 'Scrambled Eggs, Toast, OJ', lunch: 'Mac & Cheese, Broccoli, Pear', snack: 'Yogurt Cup, Water' },
  Wednesday: { breakfast: 'Banana Pancakes, Milk', lunch: 'Chicken Rice Bowl, Green Beans, Peach', snack: 'Cheese Stick, Grapes' },
  Thursday:  { breakfast: 'Whole Grain Cereal, Milk', lunch: 'PBJ Sandwich, Celery & Hummus, Orange', snack: 'Graham Crackers, Milk' },
  Friday:    { breakfast: 'Yogurt Parfait, Granola', lunch: 'Veggie Pizza, Side Salad, Watermelon', snack: 'Popcorn, Apple Juice' },
}

const MEAL_COUNTS = {
  Monday:    { breakfast: 7, lunch: 7, snack: 7 },
  Tuesday:   { breakfast: 6, lunch: 7, snack: 6 },
  Wednesday: { breakfast: 7, lunch: 7, snack: 7 },
  Thursday:  { breakfast: 5, lunch: 6, snack: 5 },
  Friday:    { breakfast: 7, lunch: 7, snack: 6 },
}

const CACFP_ITEMS = [
  { item: 'Grain/Bread served at breakfast', status: true },
  { item: 'Fluid milk served at all meals', status: true },
  { item: 'Fruit or vegetable at breakfast', status: true },
  { item: 'Protein component at lunch', status: true },
  { item: 'Grain component at lunch', status: true },
  { item: 'Two fruits/veggies at lunch', status: true },
  { item: 'Milk at snack', status: false },
  { item: 'Snack has 2 components minimum', status: true },
]

const ALLERGIES = [
  { child: 'Amara Johnson', allergy: 'Peanuts', restriction: 'No PB products. Sunflower butter OK.' },
  { child: 'Sofia Martinez', allergy: 'Dairy', restriction: 'Almond milk substitute. No cheese or yogurt.' },
  { child: 'Zoe Davis', allergy: 'Eggs', restriction: 'No scrambled eggs or egg-based dishes.' },
  { child: 'Mia Thompson', allergy: 'Shellfish', restriction: 'No fish sticks or seafood products.' },
  { child: 'Isla Robinson', allergy: 'Gluten', restriction: 'Gluten-free bread and pasta only.' },
]

export default function Meals() {
  const [selectedDay, setSelectedDay] = useState(TODAY)
  const [tab, setTab] = useState('Meal Plan')

  const cacfpPassed = CACFP_ITEMS.filter(i => i.status).length
  const cacfpTotal = CACFP_ITEMS.length

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Meals</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Weekly meal plan, CACFP compliance & allergy tracker</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 16px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>
            Print Menu
          </button>
          <button style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Edit Plan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'CACFP Compliance', value: `${cacfpPassed}/${cacfpTotal}`, color: cacfpPassed === cacfpTotal ? '#059669' : '#d97706', icon: '✅' },
          { label: 'Meals Today', value: MEAL_COUNTS[TODAY].lunch, color: '#4f46e5', icon: '🍽️' },
          { label: 'Allergy Alerts', value: ALLERGIES.length, color: '#dc2626', icon: '⚠️' },
          { label: 'Weekly Meals', value: Object.values(MEAL_COUNTS).reduce((a, b) => a + b.lunch, 0), color: '#0891b2', icon: '📅' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 32 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CACFP Alert */}
      {cacfpPassed < cacfpTotal && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
            {cacfpTotal - cacfpPassed} CACFP requirement(s) not met this week. Review snack meal components.
          </span>
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['Meal Plan', 'CACFP Tracker', 'Allergy Alerts', 'Meal Counts'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#4f46e5' : '#64748b',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }}
          >{t}</button>
        ))}
      </div>

      {/* Meal Plan Tab */}
      {tab === 'Meal Plan' && (
        <div>
          {/* Day Selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  padding: '10px 16px', border: '2px solid', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: selectedDay === d ? '#4f46e5' : '#fff',
                  color: selectedDay === d ? '#fff' : '#475569',
                  borderColor: selectedDay === d ? '#4f46e5' : d === TODAY ? '#e0e7ff' : '#e2e8f0',
                  position: 'relative',
                }}
              >
                {d.slice(0, 3)}
                {d === TODAY && selectedDay !== d && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#4f46e5', borderRadius: '50%' }} />
                )}
              </button>
            ))}
          </div>

          {/* Menu Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {['breakfast', 'lunch', 'snack'].map(meal => (
              <div key={meal} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🍎'}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>{meal}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {meal === 'breakfast' ? '7:30 – 8:30 AM' : meal === 'lunch' ? '11:30 AM – 12:30 PM' : '3:00 – 3:30 PM'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, background: '#f8fafc', borderRadius: 8, padding: 14 }}>
                  {MEAL_PLAN[selectedDay][meal]}
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                  Count: {MEAL_COUNTS[selectedDay][meal]} children
                </div>
              </div>
            ))}
          </div>

          {/* Today note */}
          {selectedDay === TODAY && (
            <div style={{ marginTop: 16, background: '#ede9fe', borderRadius: 10, padding: '12px 16px', border: '1px solid #c4b5fd' }}>
              <span style={{ fontSize: 13, color: '#5b21b6', fontWeight: 500 }}>Today's menu is active. Staff have been notified of allergy restrictions.</span>
            </div>
          )}
        </div>
      )}

      {/* CACFP Tracker */}
      {tab === 'CACFP Tracker' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>CACFP Weekly Checklist</h3>
            <div style={{ background: cacfpPassed === cacfpTotal ? '#d1fae5' : '#fef3c7', color: cacfpPassed === cacfpTotal ? '#166534' : '#92400e', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              {cacfpPassed}/{cacfpTotal} Requirements Met
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CACFP_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 8, background: item.status ? '#f0fdf4' : '#fef9c3', border: `1px solid ${item.status ? '#bbf7d0' : '#fde68a'}` }}>
                <span style={{ fontSize: 20 }}>{item.status ? '✅' : '⚠️'}</span>
                <span style={{ fontSize: 14, color: item.status ? '#166534' : '#92400e', fontWeight: 500 }}>{item.item}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: '#f0f9ff', borderRadius: 10, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, marginBottom: 4 }}>CACFP Reimbursement Status</div>
            <div style={{ fontSize: 13, color: '#0369a1' }}>7 children enrolled in free/reduced program. Estimated monthly reimbursement: ~$412</div>
          </div>
        </div>
      )}

      {/* Allergy Alerts */}
      {tab === 'Allergy Alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: '#7f1d1d', fontWeight: 600 }}>
              {ALLERGIES.length} children have documented food allergies. Review before each meal service.
            </span>
          </div>
          {ALLERGIES.map((a, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', display: 'flex', gap: 16, alignItems: 'start', border: '1px solid #fecaca' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>⚠️</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 4 }}>{a.child}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{a.allergy} Allergy</span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{a.restriction}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meal Counts */}
      {tab === 'Meal Counts' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Day', 'Breakfast', 'Lunch', 'Snack', 'Total'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(d => {
                const counts = MEAL_COUNTS[d]
                const total = counts.breakfast + counts.lunch + counts.snack
                const isToday = d === TODAY
                return (
                  <tr key={d} style={{ borderTop: '1px solid #f1f5f9', background: isToday ? '#f0f9ff' : 'transparent' }}>
                    <td style={{ padding: '14px 20px', fontWeight: isToday ? 700 : 500, color: isToday ? '#0369a1' : '#0f172a' }}>
                      {d} {isToday && <span style={{ fontSize: 11, color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: 20, marginLeft: 6 }}>Today</span>}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>{counts.breakfast}</td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>{counts.lunch}</td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>{counts.snack}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#4f46e5' }}>{total}</td>
                  </tr>
                )
              })}
              <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>Weekly Total</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{Object.values(MEAL_COUNTS).reduce((a,b)=>a+b.breakfast,0)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{Object.values(MEAL_COUNTS).reduce((a,b)=>a+b.lunch,0)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{Object.values(MEAL_COUNTS).reduce((a,b)=>a+b.snack,0)}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#4f46e5' }}>{Object.values(MEAL_COUNTS).reduce((a,b)=>a+b.breakfast+b.lunch+b.snack,0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
