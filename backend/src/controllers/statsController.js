const Match = require('../models/Match');

const cache = {};
const CACHE_TTL = 30000; // 30s cache

const getStats = async (req, res) => {
  try {
    const { league, season, team } = req.query;
    
    const cacheKey = `stats_${league||'all'}_${season||'all'}_${team||'all'}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
        return res.json(cache[cacheKey].data);
    }

    const filter = {};
    if (league) filter.league = league;
    if (season) filter.season = season;
    if (team) {
       filter.$or = [{ homeTeam: team }, { awayTeam: team }];
    }

    const matches = await Match.find(filter);
    
    if (matches.length === 0) {
        return res.json({
            totalMatches: 0, totalGoals: 0, avgGoals: 0, 
            resultsDistribution: { homeWins: 0, draws: 0, awayWins: 0 },
            teamGoals: {}, ranking: [],
            smartMetrics: { mostWins: null, mostGoals: null, lowestScoring: null }
        });
    }

    const totalMatches = matches.length;
    let totalGoals = 0;
    
    let draws = 0;
    let homeWins = 0;
    let awayWins = 0;

    const teamGoals = {};
    const teamWins = {};
    const teamPoints = {}; 

    // Aggregate stats
    matches.forEach(m => {
        // Init properties
        if (teamGoals[m.homeTeam] === undefined) teamGoals[m.homeTeam] = 0;
        if (teamGoals[m.awayTeam] === undefined) teamGoals[m.awayTeam] = 0;
        if (teamWins[m.homeTeam] === undefined) teamWins[m.homeTeam] = 0;
        if (teamWins[m.awayTeam] === undefined) teamWins[m.awayTeam] = 0;

        totalGoals += (m.homeScore + m.awayScore);

        if (m.homeScore > m.awayScore) {
          homeWins++;
          teamPoints[m.homeTeam] = (teamPoints[m.homeTeam] || 0) + 3;
          teamWins[m.homeTeam]++;
        }
        else if (m.homeScore < m.awayScore) {
          awayWins++;
          teamPoints[m.awayTeam] = (teamPoints[m.awayTeam] || 0) + 3;
          teamWins[m.awayTeam]++;
        }
        else {
          draws++;
          teamPoints[m.homeTeam] = (teamPoints[m.homeTeam] || 0) + 1;
          teamPoints[m.awayTeam] = (teamPoints[m.awayTeam] || 0) + 1;
        }

        teamGoals[m.homeTeam] += m.homeScore;
        teamGoals[m.awayTeam] += m.awayScore;
    });

    const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(2) : 0;
    const ranking = Object.keys(teamPoints).map(t => ({ team: t, points: teamPoints[t] }))
      .sort((a,b) => b.points - a.points);
      
    // Smart Analysis
    let mostWinsTeam = { team: null, wins: -1 };
    let mostGoalsTeam = { team: null, goals: -1 };
    let lowestScoringTeam = { team: null, goals: Infinity };

    Object.keys(teamGoals).forEach(t => {
        if (teamWins[t] > mostWinsTeam.wins) { mostWinsTeam = { team: t, wins: teamWins[t] }; }
        if (teamGoals[t] > mostGoalsTeam.goals) { mostGoalsTeam = { team: t, goals: teamGoals[t] }; }
        if (teamGoals[t] < lowestScoringTeam.goals) { lowestScoringTeam = { team: t, goals: teamGoals[t] }; }
    });

    const result = {
        totalMatches,
        totalGoals,
        avgGoals,
        resultsDistribution: { homeWins, draws, awayWins },
        teamGoals,
        ranking,
        smartMetrics: { 
            mostWins: mostWinsTeam.wins >= 0 ? mostWinsTeam : null, 
            mostGoals: mostGoalsTeam.goals >= 0 ? mostGoalsTeam : null, 
            lowestScoring: lowestScoringTeam.goals !== Infinity ? lowestScoringTeam : null 
        }
    };
    
    // Set cache
    cache[cacheKey] = { timestamp: Date.now(), data: result };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

module.exports = { getStats };
