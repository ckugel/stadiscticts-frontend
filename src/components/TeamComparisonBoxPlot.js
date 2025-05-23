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

  const data = {
    labels: processedTeams.map(team => team.name),
    datasets: [
      {
        label: 'Player Ranking Values',
        backgroundColor: 'rgba(24, 233, 239, 0.6)',
        borderColor: 'rgba(7, 68, 69, 1)',
        borderWidth: 2,
        outlierColor: '#999999',
        data: processedTeams.map(team => team.data)
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
      <Chart type="boxplot" data={data} options={options} />
    </div>
  );
};

export default TeamComparisonBoxPlot;
