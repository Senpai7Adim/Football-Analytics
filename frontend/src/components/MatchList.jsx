import React from 'react';
import { Calendar, Shield } from 'lucide-react';

const MatchList = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <div className="glass-card"><p>No matches found matching criteria.</p></div>;
  }

  return (
    <div className="match-card-grid">
      {matches.map(match => {
        const matchDate = new Date(match.date).toLocaleDateString(undefined, {
          day: 'numeric', month: 'short', year: 'numeric'
        });

        return (
          <div key={match.id} className="glass-card match-card">
             <div className="match-card-header">
               <span className="league-badge">{match.league}</span>
               <div className="match-date">
                 <Calendar size={14} /> {matchDate}
               </div>
             </div>
             <div className="match-teams-container">
               <div className="team home-team">
                  <span className="team-name">{match.homeTeam}</span>
                  <div className="team-logo-container home">
                    {match.homeCrest ? (
                       <img src={match.homeCrest} alt={match.homeTeam} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                       <Shield className="team-logo" size={24} />
                    )}
                  </div>
               </div>
               
               <div className="score-container">
                  <span className="score-badge">
                     {match.homeScore} - {match.awayScore}
                  </span>
               </div>
               
               <div className="team away-team">
                 <div className="team-logo-container away">
                    {match.awayCrest ? (
                       <img src={match.awayCrest} alt={match.awayTeam} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                       <Shield className="team-logo" size={24} />
                    )}
                  </div>
                  <span className="team-name">{match.awayTeam}</span>
               </div>
             </div>
          </div>
        )
      })}
    </div>
  );
};

export default MatchList;
