// src/components/TeamComparisonBoxPlot.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
);

const TeamComparisonBoxPlot = ({ teams }) => {
  // Calculate statistics for each team
  const calculateStats = (values) => {
    if (!values || values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
    
    return { min, q1, median, q3, max, mean, values: sorted };
  };

  const teamStats = teams.map(team => ({
    name: team.name,
    stats: calculateStats(team.players.map(p => p.rankingValue))
  })).filter(team => team.stats !== null);

  if (teamStats.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20, textAlign: 'center' }}>
        <p>No data available for comparison</p>
      </div>
    );
  }

  // Create datasets for different statistics
  const labels = teamStats.map(team => team.name);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Minimum',
        data: teamStats.map(team => team.stats.min),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Q1 (25th percentile)',
        data: teamStats.map(team => team.stats.q1),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Median (50th percentile)',
        data: teamStats.map(team => team.stats.median),
        backgroundColor: 'rgba(24, 233, 239, 0.8)',
        borderColor: 'rgba(7, 68, 69, 1)',
        borderWidth: 2
      },
      {
        label: 'Q3 (75th percentile)',
        data: teamStats.map(team => team.stats.q3),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Maximum',
        data: teamStats.map(team => team.stats.max),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'Mean (Average)',
        data: teamStats.map(team => team.stats.mean),
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Team Player Ranking Value Statistics Comparison'
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const teamIndex = context[0].dataIndex;
            const team = teamStats[teamIndex];
            return [
              `Players: ${team.stats.values.length}`,
              `Range: ${team.stats.min} - ${team.stats.max}`,
              `IQR: ${team.stats.q1} - ${team.stats.q3}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Ranking Value'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Teams'
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Bar data={data} options={options} />
      
      {/* Additional statistics table */}
      <div style={{ marginTop: 20, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
        <h4 style={{ marginBottom: 16, textAlign: 'center' }}>Detailed Statistics</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#18e9ef', color: '#074445' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Team</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Players</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Min</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Q1</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Median</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Mean</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Q3</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Max</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((team, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 'bold' }}>{team.name}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.values.length}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.min.toFixed(1)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.q1.toFixed(1)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.median.toFixed(1)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.mean.toFixed(1)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.q3.toFixed(1)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{team.stats.max.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamComparisonBoxPlot;
