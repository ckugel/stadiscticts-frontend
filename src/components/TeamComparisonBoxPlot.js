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

  // Get all unique years and leagues from both teams
  const allYears = Array.from(new Set(processedTeams.flatMap(team => team.players ? team.players.map(p => p.year) : []))).sort((a, b) => a - b);
  const allLeagues = Array.from(new Set(processedTeams.flatMap(team => team.players ? team.players.map(p => p.league).filter(Boolean) : [])));

  // State for selected year and league
  const [selectedYear, setSelectedYear] = React.useState('all');
  const [selectedLeague, setSelectedLeague] = React.useState('all');

  // Filter teams' player data by selected year and league
  const filteredTeams = processedTeams.map(team => ({
    ...team,
    data: team.players
      ? team.players.filter(p =>
          (selectedYear === 'all' || p.year === selectedYear) &&
          (selectedLeague === 'all' || p.league === selectedLeague)
        ).map(p => p.rankingValue).filter(val => val != null)
      : []
  }));

  // Find global min/max for scaling
  const allValues = filteredTeams.flatMap(team => team.data);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  const data = {
    labels: filteredTeams.map(team => team.name),
    datasets: filteredTeams.map((team, idx) => ({
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
            const teamData = filteredTeams[dataIndex].data;
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
      {/* Year filter buttons */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Year:</span>
        <button
          onClick={() => setSelectedYear('all')}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #18e9ef',
            background: selectedYear === 'all' ? '#18e9ef' : '#fff',
            color: selectedYear === 'all' ? '#074445' : '#000',
            fontWeight: selectedYear === 'all' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        {allYears.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #18e9ef',
              background: selectedYear === year ? '#18e9ef' : '#fff',
              color: selectedYear === year ? '#074445' : '#000',
              fontWeight: selectedYear === year ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {year}
          </button>
        ))}
      </div>
      {/* League filter buttons */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>League:</span>
        <button
          onClick={() => setSelectedLeague('all')}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #18e9ef',
            background: selectedLeague === 'all' ? '#18e9ef' : '#fff',
            color: selectedLeague === 'all' ? '#074445' : '#000',
            fontWeight: selectedLeague === 'all' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        {allLeagues.map(league => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #18e9ef',
              background: selectedLeague === league ? '#18e9ef' : '#fff',
              color: selectedLeague === league ? '#074445' : '#000',
              fontWeight: selectedLeague === league ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {league}
          </button>
        ))}
      </div>
      <Chart type="boxplot" data={data} options={options} />
    </div>
  );
};

export default TeamComparisonBoxPlot;
