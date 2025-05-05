import { useState } from 'react'
import PageLayout from './pageLayout'

function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  const suffix = hour >= 12 ? 'pm' : 'am'
  const adjusted = hour % 12 || 12
  return `${adjusted}:${minute.toString().padStart(2, '0')} ${suffix}`
}

export default function Schedule({ matchesToday, matchesTomorrow }) {
  const [activeTab, setActiveTab] = useState('today')

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const todayLabel = today.toLocaleDateString(undefined, { weekday: 'long' })
  const tomorrowLabel = tomorrow.toLocaleDateString(undefined, { weekday: 'long' })

  const displayedMatches = activeTab === 'today' ? matchesToday : matchesTomorrow

  const tabButtons = (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <button
        onClick={() => setActiveTab('today')}
        style={{
          flex: 1,
          fontWeight: activeTab === 'today' ? 'bold' : 'normal',
          backgroundColor: activeTab === 'today' ? '#2e7d32' : '#222',
          color: 'white',
          border: '1px solid #444',
          padding: '0.5rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {todayLabel}
      </button>
      <button
        onClick={() => setActiveTab('tomorrow')}
        style={{
          flex: 1,
          fontWeight: activeTab === 'tomorrow' ? 'bold' : 'normal',
          backgroundColor: activeTab === 'tomorrow' ? '#2e7d32' : '#222',
          color: 'white',
          border: '1px solid #444',
          padding: '0.5rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {tomorrowLabel}
      </button>
    </div>
  )

  return (
    <PageLayout title="Fixture" headerContent={tabButtons}>
      {displayedMatches.length === 0 ? (
        <p>No matches scheduled.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {displayedMatches.map((match, i) => (
            <li key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
              <strong>{formatTime(match.StartTime)}</strong> – {match.Court}<br />
              {match.HomeTeam} vs {match.AwayTeam}
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  )
}