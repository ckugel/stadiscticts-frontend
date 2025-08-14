import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TeamBoxPlot from "./TeamBoxPlot";
import ComparisonViolinPlot from "./ComparisonViolinPlot";
import TeamSelectionBox from "./TeamSelectionBox";
import { fetchTeamDetails } from "./teamUtils";
import "./TeamComparisonSection.css";

const TeamComparisonSection = ({ options }) => {
  const [teamInputs, setTeamInputs] = useState(["", ""]);
  const [teamDetails, setTeamDetails] = useState([null, null]);
  const [selectedLeague, setSelectedLeague] = useState([null, null]);
  const [selectedYear, setSelectedYear] = useState([null, null]);
  const [chartType, setChartType] = useState("box"); // 'box' or 'violin'
  const location = useLocation();

  const handleTeamInputChange = (idx, value) => {
    setTeamInputs((prev) =>
      prev.map((input, i) => (i === idx ? value : input)),
    );
    // Clear dependent selections when team changes
    setTeamDetails((prev) =>
      prev.map((detail, i) => (i === idx ? null : detail)),
    );
    setSelectedLeague((prev) =>
      prev.map((league, i) => (i === idx ? null : league)),
    );
    setSelectedYear((prev) => prev.map((year, i) => (i === idx ? null : year)));
  };

  const handleTeamDetailsChange = (idx, details) => {
    setTeamDetails((prev) =>
      prev.map((detail, i) => (i === idx ? details : detail)),
    );
  };

  const handleLeagueChange = (idx, league) => {
    setSelectedLeague((prev) => prev.map((l, i) => (i === idx ? league : l)));
    // Reset year when league changes
    setSelectedYear((prev) => prev.map((y, i) => (i === idx ? null : y)));
  };

  const handleYearChange = (idx, year) => {
    setSelectedYear((prev) => prev.map((y, i) => (i === idx ? year : y)));
  };

  // Load teams from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const team1 = params.get("team1");
    const team2 = params.get("team2");
    const league1 = params.get("league1");
    const league2 = params.get("league2");

    if (team1 && team2) {
      setTeamInputs([team1, team2]);
      loadTeamFromUrl(team1, 0, league1);
      loadTeamFromUrl(team2, 1, league2);
    }
  }, [location.search]);

  const loadTeamFromUrl = async (teamName, idx, preferredLeague = null) => {
    try {
      const details = await fetchTeamDetails(teamName, preferredLeague);
      handleTeamDetailsChange(idx, details);

      // Auto-select preferred league if available
      if (preferredLeague && details.leagues && details.leagues.includes(preferredLeague)) {
        setSelectedLeague((prev) =>
          prev.map((l, i) => (i === idx ? preferredLeague : l)),
        );
      }
    } catch (e) {
      console.error(`Error loading team ${teamName}:`, e.message);
    }
  };

  const isReadyForComparison = () => {
    return (
      teamInputs.every((name) => name.trim()) &&
      selectedLeague.every((league) => league) &&
      selectedYear.every((year) => year)
    );
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <section className="team-comparison-section">
      <h2 className="team-comparison-title">Compare Teams</h2>

      <div className="team-selection-container">
        {teamInputs.map((input, idx) => (
          <TeamSelectionBox
            key={idx}
            placeholder={`Team ${idx + 1} Name`}
            value={input}
            onChange={(value) => handleTeamInputChange(idx, value)}
            showLeagueYearSelection={true}
            teamDetails={teamDetails[idx]}
            selectedLeague={selectedLeague[idx]}
            selectedYear={selectedYear[idx]}
            onTeamDetailsChange={(details) =>
              handleTeamDetailsChange(idx, details)
            }
            onLeagueChange={(league) => handleLeagueChange(idx, league)}
            onYearChange={(year) => handleYearChange(idx, year)}
            isSecondary={idx === 1} // Use secondary accent color for the second team
          />
        ))}
      </div>

      <div className="chart-type-selector">
        <button
          className={`chart-type-button ${chartType === "box" ? "active" : ""}`}
          onClick={() => handleChartTypeChange("box")}
        >
          Box Plot
        </button>
        <button
          className={`chart-type-button ${chartType === "violin" ? "active" : ""}`}
          onClick={() => handleChartTypeChange("violin")}
        >
          Violin Plot
        </button>
      </div>

      {isReadyForComparison() && (
        <div className="chart-container">
          {chartType === "box" ? (
            <TeamBoxPlot
              teamOne={{
                name: teamInputs[0],
                league: selectedLeague[0],
                year: selectedYear[0],
              }}
              teamTwo={{
                name: teamInputs[1],
                league: selectedLeague[1],
                year: selectedYear[1],
              }}
            />
          ) : (
            <ComparisonViolinPlot
              teamOne={{
                name: teamInputs[0],
                league: selectedLeague[0],
                year: selectedYear[0],
              }}
              teamTwo={{
                name: teamInputs[1],
                league: selectedLeague[1],
                year: selectedYear[1],
              }}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default TeamComparisonSection;
