import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Goal, Map, ArrowDownCircle, Trophy } from 'lucide-react';
import StatCard from '../components/StatCard';
import MatchList from '../components/MatchList';
import Filters from '../components/Filters';
import GoalsBarChart from '../components/Charts/GoalsBarChart';
import ResultsPieChart from '../components/Charts/ResultsPieChart';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState({ league: '', team: '' });
  
  const availableLeagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];

  useEffect(() => {
    // Fetch unique teams for dropdown filter
    axios.get(`${API_BASE}/teams`)
         .then(res => setTeams(res.data))
         .catch(err => console.error('Error fetching teams', err));
  }, []);

  useEffect(() => {
    fetchData();
  }, [filterState]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterState.league) params.append('league', filterState.league);
      if (filterState.team) params.append('team', filterState.team);

      const [statsRes, matchesRes] = await Promise.all([
        axios.get(`${API_BASE}/stats?${params.toString()}`),
        axios.get(`${API_BASE}/matches?${params.toString()}`)
      ]);

      setStats(statsRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="dashboard">
      <Filters 
        leagues={availableLeagues} 
        teams={teams}
        filterState={filterState}
        onFilterChange={handleFilterChange} 
      />

      {loading ? (
        <div className="skeleton-container">
          <div className="stats-grid">
             <div className="skeleton skeleton-card"></div>
             <div className="skeleton skeleton-card"></div>
             <div className="skeleton skeleton-card"></div>
             <div className="skeleton skeleton-card"></div>
          </div>
          <div className="charts-grid">
             <div className="skeleton skeleton-chart"></div>
             <div className="skeleton skeleton-chart"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Smart Metrics Header */}
          <div className="stats-grid">
            <StatCard 
              title="Most Wins" 
              value={stats?.smartMetrics?.mostWins?.team ? `${stats.smartMetrics.mostWins.team} (${stats.smartMetrics.mostWins.wins})` : 'N/A'} 
              icon={Trophy} 
            />
            <StatCard 
              title="Most Goals" 
              value={stats?.smartMetrics?.mostGoals?.team ? `${stats.smartMetrics.mostGoals.team} (${stats.smartMetrics.mostGoals.goals})` : 'N/A'} 
              icon={Goal} 
            />
            <StatCard title="Avg Match Goals" value={stats?.avgGoals || 0} icon={Activity} />
            <StatCard 
              title="Lowest Scoring" 
              value={stats?.smartMetrics?.lowestScoring?.team ? `${stats.smartMetrics.lowestScoring.team} (${stats.smartMetrics.lowestScoring.goals})` : 'N/A'} 
              icon={ArrowDownCircle} 
            />
          </div>

          <div className="charts-grid">
            <GoalsBarChart teamGoals={stats?.teamGoals} />
            <ResultsPieChart distribution={stats?.resultsDistribution} />
          </div>

          <MatchList matches={matches} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
