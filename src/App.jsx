import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './components/dashboard'
import Schedule from './components/schedule'
import Ladder from './components/ladder'
import MatchPoints from './components/matchPoints'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [dots, setDots] = useState('')
  const [matchesToday, setMatchesToday] = useState([])
  const [matchesTomorrow, setMatchesTomorrow] = useState([])

  useEffect(() => {
    if (!showSplash) return
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showSplash])

  useEffect(() => {
    const init = async () => {
      try {
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        const formatDate = d => d.toISOString().split('T')[0]

        const [res1, res2] = await Promise.all([
          fetch(`https://api.cibv.com.au/raw?date=${formatDate(today)}`).then(r => r.json()),
          fetch(`https://api.cibv.com.au/raw?date=${formatDate(tomorrow)}`).then(r => r.json()),
          new Promise(res => setTimeout(res, 300)) // minimum splash time
        ])

        setMatchesToday(res1)
        setMatchesTomorrow(res2)

        // Trigger fade out
        const splashElement = document.getElementById('splash')
        if (splashElement) splashElement.style.opacity = '0'

        // Remove splash from DOM after fade
        setTimeout(() => setShowSplash(false), 500) // match transition duration
      } catch (err) {
        console.error('Error loading data:', err)
      }
    }

    init()
  }, [])

  return (
    <>
      {showSplash && (
        <div
        id="splash"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: '#1e1e1e',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.5rem',
          transition: 'opacity 0.5s ease',
          zIndex: 9999,
          opacity: 1,
          flexDirection: 'row'
        }}
      >
        🏐 <strong style={{ marginLeft: '0.5rem' }}>CIBV</strong>
        <span style={{ marginLeft: '0.5rem' }}>
          Loading
          <span style={{
            display: 'inline-block',
            minWidth: '3ch',
            textAlign: 'left'
          }}>{dots}</span>
        </span>
      </div>
      )}

      {!showSplash && (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule matchesToday={matchesToday} matchesTomorrow={matchesTomorrow} />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/match-points" element={<MatchPoints />} />
        </Routes>
      )}
    </>
  )
}