import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>CIBV Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={() => navigate('/schedule')}>📅 Upcoming Games</button>
        <button onClick={() => navigate('/match-points')}>📊 Match Points</button>
        <button onClick={() => navigate('/ladder')}>🏆 Ladder</button>
      </div>
    </div>
  )
}