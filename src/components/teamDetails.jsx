import { useEffect, useState } from 'react';
import PageLayout from './pageLayout';
import './teamDetails.css';
import { useParams } from 'react-router-dom';

export default function TeamDetails() {
  const { teamId } = useParams();  
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const proxyBase = 'https://fixi-proxy.caseyindoorbeachvolleyball.workers.dev';
  const centreId = 81;

  useEffect(() => {
    if (!teamId) return;

    const encodedEndpoint = encodeURIComponent(
      `/MobService.svc/GetMobTeamDetails?centreID=${centreId}&teamId=${teamId}`
    );

    fetch(`${proxyBase}/?endpoint=${encodedEndpoint}`)
      .then(res => res.json())
      .then(data => {
        setTeamData(data.MobTeamDetails || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching team details:', err);
        setLoading(false);
      });
  }, [teamId]);

  if (loading) {
    return (
      <PageLayout title="Team Details">
        <p>Loading...</p>
      </PageLayout>
    );
  }

  if (!teamData) {
    return (
      <PageLayout title="Team Details">
        <p>Team data not available.</p>
      </PageLayout>
    );
  }

  const { CompletedMatchCollection, BiggestWinningMargin, BiggestLosingMargin, Name } = teamData;

  const getResult = (match) => {
    const isHome = match.HomeTeam?.Id?.toString() === teamId;
    const teamScore = isHome ? match.HomeTeamScore : match.AwayTeamScore;
    const opponentScore = isHome ? match.AwayTeamScore : match.HomeTeamScore;
    if (teamScore > opponentScore) return '✅';
    if (teamScore < opponentScore) return '❌';
    return '🟰 Draw';
  };

  return (
    <PageLayout title={Name || 'Team Details'}>
      <div className="team-stats">
        <h3>Biggest Win: +{BiggestWinningMargin?.m_Item1}</h3>
        <p>{BiggestWinningMargin?.m_Item2?.[0]?.Competition} vs {BiggestWinningMargin?.m_Item2?.[0]?.Opponent}</p>

        <h3>Biggest Loss: +{BiggestLosingMargin?.m_Item1}</h3>
        <p>{BiggestLosingMargin?.m_Item2?.[0]?.Competition} vs {BiggestLosingMargin?.m_Item2?.[0]?.Opponent}</p>
      </div>

      <h3>Completed Matches</h3>
      <table className="ladder-table">
        <thead>
          <tr>
            <th>Round</th>
            <th>Date</th>
            <th>Home</th>
            <th>Away</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {CompletedMatchCollection?.map((match, index) => (
            <tr key={index}>
              <td>{match.Round}</td>
              <td>{match.MatchDate}</td>
              <td>{match.HomeTeam?.Name || '-'} ({match.HomeTeamScore})</td>
              <td>{match.AwayTeam?.Name || '-'} ({match.AwayTeamScore})</td>
              <td>{getResult(match)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}
