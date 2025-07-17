import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import AgGridTable from "../AgGrid/AgGridTable.js";
import YearDropDown from "./YearDropDown.js";
import "../AgGrid/AgGrid.css";
import "./TeamTable.css";
import TeamSelectionBox from "../TeamComparison/TeamSelectionBox";
import { fetchTeamDetails, buildComparisonUrl, fetchTeamYears } from "../TeamComparison/teamUtils";

const TeamTable = ({ theme = 'light' }) => {
  const [teamData, setTeamData] = useState({ playerEntrys: [] });
  const [years, setYearsData] = useState([]);
  const [compareTeam, setCompareTeam] = useState("");
  const { teamName, year, league } = useParams();
  const navigate = useNavigate();

  const selectorRef = useRef(null);
  const handleYearChange = (newYear) => {
    const newPath = `/team/${teamName}/${newYear}/${league}`;
    navigate(newPath);
  };

  const handleCompare = async () => {
    if (compareTeam.trim()) {
      try {
        // Fetch league info for team2 to build smarter comparison URL
        const team2Details = await fetchTeamDetails(compareTeam.trim());
        const team2Leagues = team2Details.leagues;

        // Prefer matching league, otherwise use first available
        const preferredLeague = team2Leagues.includes(league) ? league : team2Leagues[0];

        const url = buildComparisonUrl(teamName, compareTeam.trim(), league, preferredLeague);
        navigate(url);
      } catch (error) {
        console.log('Could not fetch league for team2:', error);
        // Fallback to basic comparison without team2 league
        const url = buildComparisonUrl(teamName, compareTeam.trim(), league);
        navigate(url);
      }
    }
  };

  const handleCompareTeamChange = (value) => {
    setCompareTeam(value);
  };

  useEffect(() => {
    if (teamName) {

      // Fetch team data using the correct endpoint structure
      let endpoint = `${API_BASE_URL}${ENDPOINTS.TEAM}/${encodeURIComponent(teamName)}`;
      if (year && year !== "all") {
        endpoint += `/${year}`;
      }
      if (league) {
        endpoint += `?league=${league}`;
      }

      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Simplified data processing - just pass through what we get
          if (Array.isArray(data.players) && data.players && data) {
            setTeamData({ playerEntrys: data.players });
          } else if (data && Array.isArray(data)) {
            setTeamData({ playerEntrys: data });
          } else {
            setTeamData({ playerEntrys: [] });
          }
        })
        .catch((error) => {
          setTeamData({ playerEntrys: [] });
        });

      // Fetch years using the correct endpoint
      if (league) {
        fetchTeamYears(teamName, league)
          .then((years) => {
            setYearsData(Array.isArray(years) ? years : []);
          })
          .catch((error) => {
            setYearsData([]); // Set empty array on error
          });
      } else {
        // If no league specified, try to get years from team data
        setYearsData([]);
      }
    }
  }, [teamName, league, year]);

  return (
    <div className="TablePage">
      <div className="aboveTable">
        <div className="left-section">
          <h2 className={`team-title ${theme}`}>Team: {teamName}</h2>
          <YearDropDown
            ref={selectorRef}
            years={Array.isArray(years) ? years : []}
            onYearChange={handleYearChange}
            theme={theme}
          />
        </div>
        <div className="center-section">
          <TeamSelectionBox
            placeholder="Compare to another team..."
            value={compareTeam}
            onChange={handleCompareTeamChange}
            theme={theme}
            showLeagueYearSelection={true}
            style={{ minWidth: 250 }}
          />
          <button
            onClick={handleCompare}
            className="compare-button enabled"
          >
            Compare
          </button>
        </div>
        <div className="right-section">
          {/* Empty space for balanced layout */}
        </div>
      </div>
      <div className="table">
        <AgGridTable
          rowData={Array.isArray(teamData.playerEntrys) ? teamData.playerEntrys : []}
          columnDefs={[
            {
              headerName: "Player Name",
              field: "name",
              cellRenderer: (params) => (
                <Link to={`/players/${params.data.name}`}>
                  {params.data.name}
                </Link>
              ),
              flex: 1,
            },
            {
              headerName: "Year",
              field: "year",
              sortable: true,
              flex: 1,
            },
            {
              headerName: "Ranking Value",
              field: "rankingValue",
              sortable: true,
              flex: 1,
            },
          ]}
          domLayout="autoHeight"
          suppressHorizontalScroll={true}
        />
      </div>
    </div>
  );
};

export default TeamTable;
