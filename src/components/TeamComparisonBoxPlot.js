// src/components/TeamComparisonBoxPlot.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
} from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  BoxPlotController,
  BoxAndWiskers
);

const TeamComparisonBoxPlot = ({ teams }) => {
  // Process data for box plot
  const processTeamData = (teams) => {
    return teams.map(team => ({
      name: team.name,
      data: team.players.map(p => p.rankingValue).filter(val => val != null)
    })).filter(team => team.data.length > 0);
  };

  const processedTeams = processTeamData(teams);

  if (processedTeams.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20, textAlign: 'center' }}>
        <p>No data available for comparison</p>
      </div>
    );
  }

  // Assign distinct colors for each team
  const boxColors = [
    'rgba(24, 233, 239, 0.6)', // cyan
    'rgba(255, 99, 132, 0.6)', // pink/red
    'rgba(54, 162, 235, 0.6)', // blue
    'rgba(255, 206, 86, 0.6)', // yellow
    'rgba(75, 192, 192, 0.6)', // teal
    'rgba(153, 102, 255, 0.6)', // purple
    'rgba(255, 159, 64, 0.6)'  // orange
  ];
  const borderColors = [
    'rgba(7, 68, 69, 1)',
    'rgba(200, 30, 80, 1)',
    'rgba(30, 100, 200, 1)',
    'rgba(200, 180, 40, 1)',
    'rgba(30, 180, 180, 1)',
    'rgba(100, 60, 200, 1)',
    'rgba(200, 120, 30, 1)'
  ];

  // Find global min/max for scaling
  const allValues = processedTeams.flatMap(team => team.data);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  const data = {
    labels: processedTeams.map(team => team.name),
    datasets: processedTeams.map((team, idx) => ({
      label: team.name,
      backgroundColor: boxColors[idx % boxColors.length],
      borderColor: borderColors[idx % borderColors.length],
      borderWidth: 2,
      outlierColor: '#999999',
      data: [team.data]
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Team Player Ranking Value Comparison (Box Plot)'
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const dataIndex = context[0].dataIndex;
            const teamData = processedTeams[dataIndex].data;
            const sorted = [...teamData].sort((a, b) => a - b);
            const min = Math.min(...sorted);
            const max = Math.max(...sorted);
            const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
            return [
              `Players: ${sorted.length}`,
              `Min: ${min.toFixed(1)}`,
              `Max: ${max.toFixed(1)}`,
              `Mean: ${mean.toFixed(1)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: globalMin === globalMax ? globalMin - 1 : globalMin - Math.abs(globalMin * 0.1),
        max: globalMin === globalMax ? globalMax + 1 : globalMax + Math.abs(globalMax * 0.1),
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
      <Chart type="boxplot" data={data} options={options} />
    </div>
  );
};

export default TeamComparisonBoxPlot;
