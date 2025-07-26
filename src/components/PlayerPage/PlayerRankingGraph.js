import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getLeagueDisplayName } from "../../utils/leagueUtils";

const PlayerRankingGraph = ({ data }) => {
  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Sort data by year and create chart points
    return data
      .filter(item => item.rankingValue !== null && item.rankingValue !== undefined)
      .sort((a, b) => a.year - b.year)
      .map(item => ({
        year: item.year,
        rankingValue: parseFloat(item.rankingValue),
        team: item.team,
        league: getLeagueDisplayName(item.league),
        originalLeague: item.league
      }));
  }, [data]);

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Year:</strong> {label}</p>
          <p><strong>Ranking Value:</strong> {data.rankingValue.toFixed(2)}</p>
          <p><strong>Team:</strong> {data.team}</p>
          <p><strong>League:</strong> {data.league}</p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="no-data-message" style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        No ranking data available to display
      </div>
    );
  }

  return (
    <div className="PlayerRankingGraph" style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Ranking Value Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="rankingValue"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Ranking Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerRankingGraph;
