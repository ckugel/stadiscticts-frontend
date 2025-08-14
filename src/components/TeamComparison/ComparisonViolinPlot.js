import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { ViolinController, Violin } from "@sgratzl/chartjs-chart-boxplot";
import { Chart } from "react-chartjs-2";
import { fetchTeamByYearAndLeague } from "./teamUtils";
import "./ComparisonViolinPlot.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  ViolinController,
  Violin,
);

const violinColors = ["rgba(24, 233, 239, 0.6)", "rgba(255, 99, 132, 0.6)"];
const borderColors = ["rgba(7, 68, 69, 1)", "rgba(200, 30, 80, 1)"];

const ComparisonViolinPlot = ({ teamOne, teamTwo }) => {
  const [teamOneData, setTeamOneData] = useState(null);
  const [teamTwoData, setTeamTwoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Fetch team data based on team info
  useEffect(() => {
    const fetchTeamData = async () => {
      // Store current scroll position before loading
      const scrollPosition = window.scrollY;

      setLoading(true);
      setError(null);

      try {
        // Fetch data for both teams using the existing utility function
        const [team1Data, team2Data] = await Promise.all([
          fetchTeamByYearAndLeague(teamOne.name, teamOne.year, teamOne.league),
          fetchTeamByYearAndLeague(teamTwo.name, teamTwo.year, teamTwo.league),
        ]);

        setTeamOneData(team1Data);
        setTeamTwoData(team2Data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
        // Restore scroll position after loading
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
    };

    if (teamOne && teamTwo) {
      fetchTeamData();
    }
  }, [teamOne, teamTwo]);

  if (loading) {
    return (
      <div className="comparison-violin-plot-container">
        Loading team comparison...
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-violin-plot-container">Error: {error}</div>
    );
  }

  if (!teamOneData || !teamTwoData) {
    return (
      <div className="comparison-violin-plot-container">
        No data available for comparison
      </div>
    );
  }

  // Process team data for violin plot - handle different possible data structures
  const processTeamData = (teamData) => {
    // Try different possible data structures
    let players = [];

    if (teamData.playerEntrys && Array.isArray(teamData.playerEntrys)) {
      players = teamData.playerEntrys;
    } else if (teamData.players && Array.isArray(teamData.players)) {
      players = teamData.players;
    } else if (Array.isArray(teamData)) {
      players = teamData;
    }

    if (players.length === 0) {
      return [];
    }

    const values = players
      .map((player) => player.displayValue)
      .filter((val) => val != null && val !== undefined && !isNaN(val));
    return values;
  };

  const team1Values = processTeamData(teamOneData);
  const team2Values = processTeamData(teamTwoData);

  if (team1Values.length === 0 && team2Values.length === 0) {
    return (
      <div className="comparison-violin-plot-container">
        No ranking data available for comparison
      </div>
    );
  }

  console.log("Violin plot data.labels:", [teamOne.name, teamTwo.name]);
  console.log("Violin plot data.datasets[0].data:", [team1Values, team2Values]);

  const data = {
    labels: [teamOne.name, teamTwo.name],
    datasets: [
      {
        label: "Team Comparison",
        backgroundColor: [violinColors[0], violinColors[1]],
        borderColor: [borderColors[0], borderColors[1]],
        borderWidth: 2,
        outlierColor: "#999999",
        data: [team1Values, team2Values],
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Team Player Pivot Point Distribution (${teamOne.year} - ${teamOne.league} vs ${teamTwo.year} - ${teamTwo.league})`,
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const dataIndex = context[0].dataIndex;
            const teamData = dataIndex === 0 ? team1Values : team2Values;

            if (!teamData || teamData.length === 0) {
              return ["No data available"];
            }

            const validValues = teamData.filter(
              (val) => typeof val === "number" && !isNaN(val),
            );

            if (validValues.length === 0) {
              return ["No valid ranking values"];
            }

            const sorted = [...validValues].sort((a, b) => a - b);
            const min = sorted[0];
            const max = sorted[sorted.length - 1];
            const mean =
              sorted.reduce((sum, val) => sum + val, 0) / sorted.length;

            // Calculate quartiles for violin plot reference
            const q1 = sorted[Math.floor(sorted.length * 0.25)];
            const median = sorted[Math.floor(sorted.length * 0.5)];
            const q3 = sorted[Math.floor(sorted.length * 0.75)];

            return [
              `Players: ${sorted.length}`,
              `Min: ${min.toFixed(1)}`,
              `Q1: ${q1.toFixed(1)}`,
              `Median: ${median.toFixed(1)}`,
              `Q3: ${q3.toFixed(1)}`,
              `Max: ${max.toFixed(1)}`,
              `Mean: ${mean.toFixed(1)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Pivot Points" },
      },
      x: {
        title: { display: false, text: "dist" },
        // categoryPercentage: 0.8,
        // barPercentage: 0.9,
      },
    },
    elements: {
      violin: {
        itemRadius: 1,
        itemStyle: "line",
        itemBackgroundColor: "rgba(255,0,0,0.5)",
        itemBorderColor: "rgba(255,0,0,0.8)",
        outlierRadius: 0,
        medianColor: "rgba(0,0,0,1)",
        whiskerColor: "rgba(0,0,0,0.8)",
        whiskerWidth: 2,
        jitter: 0,
        padding: 10,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div ref={containerRef} className="comparison-violin-plot-container">
      <Chart type="violin" data={data} options={options} />
    </div>
  );
};

export default ComparisonViolinPlot;
