import React, { useState, useEffect, useRef } from "react";
import { fetchTeamDetails, getTeamSuggestions } from "./teamUtils";
import "./TeamSelectionBox.css";

const TeamSelectionBox = ({
  placeholder = "Enter team name...",
  value = "",
  onChange,
  onTeamSelect,
  onTeamDetailsChange,
  theme = "dark",
  style = {},
  showLeagueYearSelection = false,
  teamDetails = null,
  selectedLeague = null,
  selectedYear = null,
  onLeagueChange,
  onYearChange,
  isSecondary = false, // New prop for secondary accent color
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleInputChange = async (inputValue) => {
    onChange(inputValue);
    setShowDropdown(true);

    const suggestions = await getTeamSuggestions(inputValue);
    setSearchResults(suggestions);
  };

  const handleSelectTeam = async (team) => {
    const cleanName = team.teamName.replace(/^"|"$/g, "");
    onChange(cleanName);
    setShowDropdown(false);
    setSearchResults([]);

    if (onTeamSelect) onTeamSelect(team);

    if (showLeagueYearSelection && onTeamDetailsChange) {
      await loadTeamDetails(cleanName);
    }
  };

  const loadTeamDetails = async (teamName) => {
    try {
      setLoading(true);
      console.log("Loading team details for:", teamName); // Debug log
      const details = await fetchTeamDetails(teamName);
      console.log("Team details loaded:", details); // Debug log
      onTeamDetailsChange(details);
    } catch (e) {
      console.error(`Error fetching team details: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async () => {
    const teamName = value.trim();
    if (
      teamName &&
      showLeagueYearSelection &&
      onTeamDetailsChange &&
      !teamDetails
    ) {
      await loadTeamDetails(teamName);
    }
  };

  return (
    <div
      className={`team-selection-box ${isSecondary ? "secondary" : ""}`}
      style={style}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 150);
          handleTeamSubmit();
        }}
        onKeyPress={(e) => e.key === "Enter" && handleTeamSubmit()}
        className={`team-selection-input ${theme}`}
        autoComplete="off"
      />

      {showDropdown && searchResults.length > 0 && (
        <div className={`team-selection-dropdown ${theme}`}>
          {searchResults.map((team, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelectTeam(team)}
              className={`team-selection-dropdown-item ${theme}`}
            >
              <div className="team-name">{team.teamName}</div>
              {team.league && (
                <div className="team-league">League: {team.league}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && <div className="loading-text">Loading team details...</div>}

      {showLeagueYearSelection &&
        teamDetails &&
        teamDetails.leagues.length > 0 && (
          <div className="selection-section">
            <span className={`selection-label ${theme}`}>Select League:</span>
            <div className="selection-buttons">
              {teamDetails.leagues.map((lg) => (
                <button
                  key={lg}
                  onClick={() => {
                    onLeagueChange(lg);
                    if (onYearChange) onYearChange(null);
                  }}
                  className={`selection-button ${theme} ${selectedLeague === lg ? "selected" : ""}`}
                >
                  {lg}
                </button>
              ))}
            </div>
          </div>
        )}

      {showLeagueYearSelection &&
        teamDetails &&
        selectedLeague &&
        teamDetails.years.length > 0 && (
          <div className="selection-section">
            <span className={`selection-label ${theme}`}>Select Year:</span>
            <div className="selection-buttons">
              {teamDetails.years.slice(1).map((yr) => (
                <button
                  key={yr}
                  onClick={() => onYearChange(yr)}
                  className={`selection-button ${theme} ${selectedYear === yr ? "selected" : ""}`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default TeamSelectionBox;
