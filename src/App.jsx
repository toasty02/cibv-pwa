import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Schedule from './components/schedule';
import Ladder from './components/ladder';
import MatchPoints from './components/matchPoints';
import TeamDetails from './components/teamDetails';

const proxyBase = 'https://fixi-proxy.caseyindoorbeachvolleyball.workers.dev';
const centreId = 81;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [dots, setDots] = useState('');
  const [matchesToday, setMatchesToday] = useState([]);
  const [matchesTomorrow, setMatchesTomorrow] = useState([]);
  const [mobData, setMobData] = useState(null);

  useEffect(() => {
    fetch(`${proxyBase}/?endpoint=${encodeURIComponent(`/MobService.svc/GetMobById?Id=${centreId}`)}`)
      .then(res => res.json())
      .then(setMobData)
      .catch(err => console.error("Failed to load FiXi data", err));
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
      setDots(prev => (prev === '...' ? '' : prev + '.'));
    }, 1000);
    return () => clearInterval(interval);
  }, [showSplash]);

  useEffect(() => {
    const init = async () => {
      try {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const format = d => d.toISOString().split('T')[0];
  
        const [res1, res2] = await Promise.all([
          fetch(`https://api.cibv.com.au/raw?date=${format(today)}`).then(r => r.json()),
          fetch(`https://api.cibv.com.au/raw?date=${format(tomorrow)}`).then(r => r.json()),
          new Promise(res => setTimeout(res, 300))
        ]);
  
        setMatchesToday(res1);
        setMatchesTomorrow(res2);
  
        const splash = document.getElementById('splash');
        if (splash) splash.style.opacity = '0';
        setTimeout(() => setShowSplash(false), 500);
      } catch (err) {
        console.error('Error loading match data:', err);
      }
    };
    init();
  }, []);  

  return (
    <>
      {showSplash && (
        <div id="splash" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
          backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1.5rem', transition: 'opacity 0.5s ease', zIndex: 9999
        }}>
          🏐 <strong style={{ marginLeft: '0.5rem' }}>CIBV</strong>
          <span style={{ marginLeft: '0.5rem' }}>
            Loading<span style={{ display: 'inline-block', minWidth: '3ch' }}>{dots}</span>
          </span>
        </div>
      )}

      {!showSplash && (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule matchesToday={matchesToday} matchesTomorrow={matchesTomorrow} />} />
          <Route path="/ladder" element={<Ladder mobData={mobData} />} />
          <Route path="/match-points" element={<MatchPoints />} />
          <Route path="/team/:teamId" element={<TeamDetails />} />
        </Routes>
      )}
    </>
  );
}
