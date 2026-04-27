import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GoalsBarChart = ({ teamGoals }) => {
  if (!teamGoals || Object.keys(teamGoals).length === 0) return null;

  const data = {
    labels: Object.keys(teamGoals),
    datasets: [
      {
        label: 'Goals Scored',
        data: Object.values(teamGoals),
        backgroundColor: 'rgba(56, 189, 248, 0.7)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
        maxBarThickness: 45
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#f8fafc' } },
      title: { display: false }
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
    }
  };

  const chartWidth = Math.max(600, data.labels.length * 60);

  return (
    <div className="glass-card chart-container" style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <h3>Goals per Team</h3>
      <div className="custom-scroll" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px' }}>
        <div style={{ position: 'relative', height: '400px', minWidth: `${chartWidth}px` }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default GoalsBarChart;
