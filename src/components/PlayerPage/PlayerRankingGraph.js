import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getLeagueDisplayName } from "../../utils/leagueUtils";
import "./PlayerRankingGraph.css";
import "./PlayerPage.css";

const PlayerRankingGraph = ({ data }) => {
  const [showRankingValue, setShowRankingValue] = useState(false);
  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Choose which value field to use based on the toggle
    const valueField = showRankingValue ? "rankingValue" : "displayValue";

    // Sort data by year and create chart points
    return data
      .filter(
        (item) => item[valueField] !== null && item[valueField] !== undefined,
      )
      .sort((a, b) => a.yearValueTwo - b.yearValueTwo)
      .map((item) => ({
        year: item.yearValueTwo,
        rankingValue: parseFloat(item[valueField]),
        team: item.team,
        league: getLeagueDisplayName(item.league),
        originalLeague: item.league,
      }));
  }, [data, showRankingValue]);

  // Calculate all integer years in the data range for X-axis ticks
  const yearTicks = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    const years = chartData.map((item) => item.year);
    const minYear = Math.floor(Math.min(...years));
    const maxYear = Math.ceil(Math.max(...years));

    const ticks = [];
    for (let year = minYear; year <= maxYear; year++) {
      ticks.push(year);
    }
    return ticks;
  }, [chartData]);

  // Calculate domain to match the ticks exactly
  const yearDomain = useMemo(() => {
    if (yearTicks.length === 0) return ["dataMin", "dataMax"];
    return [yearTicks[0], yearTicks[yearTicks.length - 1]];
  }, [yearTicks]);

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const tooltipData = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>
            <strong>Year:</strong> {label}
          </p>
          <p>
            <strong>BIDs:</strong> {tooltipData.rankingValue.toFixed(2)}
          </p>
          <p>
            <strong>Team:</strong> {tooltipData.team}
          </p>
          <p>
            <strong>League:</strong> {tooltipData.league}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="no-data-message">
        No ranking data available to display
      </div>
    );
  }

  // Only show chart if there are more than 3 data points
  if (chartData.length <= 3) {
    return (
      <div className="insufficient-data-message">
        Chart requires more than 3 data points to display trends effectively.
        Currently showing {chartData.length} data point
        {chartData.length === 1 ? "" : "s"}.
      </div>
    );
  }

  return (
    <div className="PlayerRankingGraph">
      <div className="player-graph-section">
        <div className="graph-controls">
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="graphType"
                value="display"
                checked={!showRankingValue}
                onChange={() => setShowRankingValue(false)}
              />
              <span>Accumulating</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="graphType"
                value="ranking"
                checked={showRankingValue}
                onChange={() => setShowRankingValue(true)}
              />
              <span>Change</span>
            </label>
          </div>
        </div>
        <h3 className="graph-title">
          {showRankingValue ? "BIDs Over Time" : "Display Value Over Time"}
        </h3>
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
              domain={yearDomain}
              ticks={yearTicks}
            />
            <YAxis />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Line
              type="linear"
              dataKey="rankingValue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={showRankingValue ? "BIDs" : "Display Value"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlayerRankingGraph;
