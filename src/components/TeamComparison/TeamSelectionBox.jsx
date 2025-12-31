import React, { useState, useRef } from "react";
import { fetchTeamDetails, getTeamSuggestions } from "./teamUtils";
import { getDisplayLeagueName } from "../../utils/leagueUtils";
import "./TeamSelectionBox.css";

/**
 * TeamSelectionBox Component
 *
 * A component that provides team search with autocomplete functionality and optional
 * league/year selection for team comparison features.
 *
 * Flow:
 * 1. User types team name → shows dropdown with suggestions including league info
 * 2. User selects team from dropdown → captures both team name and league
 * 3. Component automatically loads team details with league-specific data
 * 4. If years are available for the selected league, shows year selection buttons
 *
 * @param {string} placeholder - Input placeholder text
 * @param {string} value - Current input value (controlled component)
 * @param {function} onChange - Callback for input value changes
 * @param {function} onTeamSelect - Callback when team is selected from dropdown
 * @param {function} onTeamDetailsChange - Callback when team details are loaded
 * @param {object} style - Additional styles for the container
 * @param {boolean} showLeagueYearSelection - Whether to show league/year selection UI
 * @param {object} teamDetails - Current team details object
 * @param {string} selectedLeague - Currently selected league
 * @param {string} selectedYear - Currently selected year
 * @param {function} onLeagueChange - Callback for league selection changes
 * @param {function} onYearChange - Callback for year selection changes
 * @param {boolean} isSecondary - Whether to use secondary styling (for second team)
 */
const TeamSelectionBox = ({
  placeholder = "Enter team name...",
  value = "",
  onChange,
  onTeamSelect,
  onTeamDetailsChange,
  style = {},
  showLeagueYearSelection = false,
  teamDetails = null,
  selectedLeague = null,
  selectedYear = null,
  onLeagueChange,
  onYearChange,
  isSecondary = false,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  /**
   * Handles input changes and triggers team search suggestions
   * @param {string} inputValue - The current input value
   */
  const handleInputChange = async (inputValue) => {
    onChange(inputValue);
    setShowDropdown(true);

    if (inputValue.length > 1) {
      const suggestions = await getTeamSuggestions(inputValue);
      setSearchResults(suggestions);
    } else {
      setSearchResults([]);
    }
  };

  /**
   * Handles team selection from the dropdown
   * This captures both the team name and league, then loads team details
   * @param {object} team - Selected team object with name and league properties
   */
  const handleSelectTeam = async (team) => {
    const cleanName = team.name.replace(/^"|"$/g, "");
    onChange(cleanName);
    setShowDropdown(false);
    setSearchResults([]);

    if (onTeamSelect) onTeamSelect(team);

    // Set the league from the dropdown selection
    if (team.league && onLeagueChange) {
      onLeagueChange(team.league);
    }

    // Load team details with the selected league to get league-specific years
    if (showLeagueYearSelection && onTeamDetailsChange) {
      setLoading(true);
      try {
        const selectedLeague = team.league || null;
        const details = await fetchTeamDetails(cleanName, selectedLeague);
        onTeamDetailsChange(details);
      } catch (e) {
        console.error(`Error loading team details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Handles team submission when user types and presses Enter or input loses focus
   * Only loads team details if no team has been selected from dropdown yet
   */
  const handleTeamSubmit = async () => {
    const teamName = value.trim();
    // Only load if we don't have details and no league selected (prevents duplicate calls)
    if (teamName && showLeagueYearSelection && onTeamDetailsChange && !teamDetails && !selectedLeague) {
      setLoading(true);
      try {
        const details = await fetchTeamDetails(teamName, null);
        onTeamDetailsChange(details);
      } catch (e) {
        console.error(`Error loading team details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`team-selection-box ${isSecondary ? "secondary" : ""}`} style={style}>
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
        onKeyDown={(e) => e.key === "Enter" && handleTeamSubmit()}
        className="team-selection-input"
        autoComplete="off"
      />

      {/* Team suggestions dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div className="team-selection-dropdown">
          {searchResults.map((team, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelectTeam(team)}
              className="team-selection-dropdown-item"
            >
              <div className="team-name">{team.name}</div>
              {team.league && (
                <div className="team-league">{getDisplayLeagueName(team.league)}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && <div className="loading-text">Loading team details...</div>}

      {/* Year selection buttons - only shown when team details loaded with league */}
      {showLeagueYearSelection &&
       teamDetails &&
       selectedLeague &&
       teamDetails.years &&
       teamDetails.years.length > 0 && (
        <div className="selection-section">
          <span className="selection-label">Select Year:</span>
          <div className="selection-buttons">
            {teamDetails.years.map((yr) => (
              <button
                key={yr}
                onClick={() => onYearChange && onYearChange(yr)}
                className={`selection-button ${selectedYear === yr ? "selected" : ""}`}
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
