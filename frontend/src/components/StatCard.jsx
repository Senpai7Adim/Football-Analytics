import React from 'react';

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="glass-card stat-card">
      <div className="stat-icon">
        {Icon && <Icon size={28} />}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
