import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './pageLayout';
import './ladder.css';

const proxyBase = 'https://fixi-proxy.caseyindoorbeachvolleyball.workers.dev';
const centreId = 81;

export default function Ladder({ mobData }) {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [ladder, setLadder] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobData) return;

    const competitions = mobData.Centre.Sport.flatMap((sport) =>
      (sport.Competition || []).map((comp) => ({
        divisionId: comp.DivisionID,
        seasonId: comp.SeasonID,
        sportId: sport.Id,
        name: `${sport.Name.trim()} – ${comp.DivisionName.trim()}`
      }))
    );

    setDivisions(competitions);
  }, [mobData]);

  useEffect(() => {
    if (!selectedDivision) return;

    const { sportId, divisionId, seasonId } = selectedDivision;
    const endpoint = `/MobService.svc/GetMobComp?centreID=${centreId}&sportid=${sportId}&divisionID=${divisionId}&seasonID=${seasonId}`;

    fetch(`${proxyBase}/?endpoint=${encodeURIComponent(endpoint)}`)
      .then(res => res.json())
      .then(data => setLadder(data.Ladder || []))
      .catch(err => console.error('Failed to fetch ladder:', err));
  }, [selectedDivision]);

  return (
    <PageLayout title="Ladder">
      {!mobData ? (
        <p style={{ opacity: 0.7 }}>Loading divisions...</p>
      ) : (
        <>
          <label>
            Division:
            <select
              onChange={(e) =>
                setSelectedDivision(divisions.find(d => d.divisionId.toString() === e.target.value))
              }
              value={selectedDivision?.divisionId?.toString() || ''}
            >
              <option value="">-- Select Division --</option>
              {divisions.map((d) => (
                <option key={d.divisionId} value={d.divisionId}>{d.name}</option>
              ))}
            </select>
          </label>

          {ladder.length > 0 ? (
            <table className="ladder-table">
              <thead>
                <tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {[...ladder].sort((a, b) => b.points - a.points).map((entry, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/team/${entry.Team?.Id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{entry.Team?.Name || 'Unnamed Team'}</td>
                    <td>{entry.played}</td>
                    <td>{entry.won}</td>
                    <td>{entry.lost}</td>
                    <td>{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>No ladder data available.</p>
          )}
        </>
      )}
    </PageLayout>
  );
}