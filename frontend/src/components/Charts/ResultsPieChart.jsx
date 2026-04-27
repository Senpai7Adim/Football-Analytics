import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsPieChart = ({ distribution }) => {
  if (!distribution) return null;

  const data = {
    labels: ['Home Wins', 'Draws', 'Away Wins'],
    datasets: [
      {
        data: [distribution.homeWins, distribution.draws, distribution.awayWins],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // Success
          'rgba(245, 158, 11, 0.7)', // Warning
          'rgba(239, 68, 68, 0.7)'   // Danger
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#f8fafc', padding: 20 } }
    }
  };

  return (
    <div className="glass-card chart-container">
      <h3>Match Results Distribution</h3>
      <div className="chart-wrapper">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default ResultsPieChart;
