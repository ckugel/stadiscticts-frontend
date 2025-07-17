import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart } from "react-chartjs-2";
import { API_BASE_URL, ENDPOINTS } from '../../constants/api';
import './TeamBoxPlot.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  BoxPlotController,
  BoxAndWiskers,
);

const boxColors = [
  "rgba(24, 233, 239, 0.6)",
  "rgba(255, 99, 132, 0.6)",
];
const borderColors = [
  "rgba(7, 68, 69, 1)",
  "rgba(200, 30, 80, 1)",
];

const TeamBoxPlot = ({ teamOne, teamTwo }) => {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async (team) => {
      if (!team || !team.name || !team.league || !team.year) return null;

      try {
        console.log('Fetching team data for comparison:', team);

        // Build endpoint exactly like in TeamTable
        let endpoint = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(team.name)}`;
        if (team.year && team.year !== "all") {
          endpoint += `/${team.year}`;
        }
        if (team.league) {
          endpoint += `?league=${team.league}`;
        }

        console.log('Team comparison endpoint:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch team: ${team.name} (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('Team comparison data received:', data);

        // Handle the data structure same as TeamTable
        let players = [];
        if (data && data.players && Array.isArray(data.players)) {
          players = data.players;
        } else if (data && data.playerEntrys && Array.isArray(data.playerEntrys)) {
          players = data.playerEntrys;
        } else if (Array.isArray(data)) {
          players = data;
        }

        console.log('Processed players for', team.name, ':', players);

        return {
          name: team.name,
          players: players
        };
      } catch (error) {
        console.error(`Error fetching team ${team.name}:`, error);
        throw new Error(`Failed to fetch team: ${team.name}`);
      }
    };

    const fetchData = async () => {
      if (!teamOne || !teamTwo || !teamOne.name || !teamTwo.name ||
          !teamOne.league || !teamTwo.league || !teamOne.year || !teamTwo.year) {
        setTeamsData([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        console.log('Fetching comparison data for teams:', teamOne, teamTwo);

        const [dataOne, dataTwo] = await Promise.all([
          fetchTeam(teamOne),
          fetchTeam(teamTwo),
        ]);

        const validTeams = [dataOne, dataTwo].filter(Boolean);
        console.log('Valid teams data:', validTeams);
        setTeamsData(validTeams);
      } catch (e) {
        console.error('Error fetching comparison data:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamOne, teamTwo]);

  if (loading) return <div>Loading team data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!teamsData.length) return <div>No data to display.</div>;

  // Prepare data for box plot - use rankingValue from the players
  const processedTeams = teamsData.map((team) => ({
    name: team.name,
    data: team.players.map((p) => p.rankingValue).filter((val) => val != null && val !== undefined),
  })).filter((team) => team.data.length > 0);

  if (processedTeams.length === 0) {
    return <div>No player data available for selected teams.</div>;
  }

  const allValues = processedTeams.flatMap((team) => team.data);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  const data = {
    labels: processedTeams.map((team) => team.name),
    datasets: processedTeams.map((team, idx) => ({
      label: team.name,
      backgroundColor: boxColors[idx % boxColors.length],
      borderColor: borderColors[idx % borderColors.length],
      borderWidth: 2,
      outlierColor: "#999999",
      data: [team.data],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Team Player Ranking Value Comparison (${teamOne.year})`,
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
              `Mean: ${mean.toFixed(1)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: globalMin === globalMax ? globalMin - 1 : globalMin - Math.abs(globalMin * 0.1),
        max: globalMin === globalMax ? globalMax + 1 : globalMax + Math.abs(globalMax * 0.1),
        title: { display: true, text: "Ranking Value" },
      },
      x: { title: { display: true, text: "Teams" } },
    },
  };

  return (
    <div className="team-box-plot-container">
      <Chart type="boxplot" data={data} options={options} />
    </div>
  );
};

export default TeamBoxPlot;
