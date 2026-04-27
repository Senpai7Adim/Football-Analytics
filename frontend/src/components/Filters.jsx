import React from 'react';

const Filters = ({ leagues, teams, onFilterChange, filterState }) => {
  return (
    <div className="filters-container">
      <select 
        className="filter-select"
        value={filterState.league}
        onChange={(e) => onFilterChange('league', e.target.value)}
      >
        <option value="">All Leagues</option>
        {leagues.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      {teams && teams.length > 0 && (
          <select 
            className="filter-select team-select"
            value={filterState.team || ''}
            onChange={(e) => onFilterChange('team', e.target.value)}
          >
            <option value="">All Teams (Filter by Team)</option>
            {teams.sort().map(t => <option key={t} value={t}>{t}</option>)}
          </select>
      )}
    </div>
  );
};

export default Filters;
