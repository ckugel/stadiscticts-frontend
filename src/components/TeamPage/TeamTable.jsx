import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import AgGridTable from "../AgGrid/AgGridTable.jsx";
import YearDropDown from "./YearDropDown.jsx";
import "../AgGrid/AgGrid.css";
import "./TeamTable.css";
import TeamSelectionBox from "../TeamComparison/TeamSelectionBox";
import {
  fetchTeamDetails,
  buildComparisonUrl,
  fetchTeamYears,
} from "../TeamComparison/teamUtils";

const TeamTable = () => {
  const [teamData, setTeamData] = useState({ playerEntrys: [] });
  const [years, setYearsData] = useState(["all"]);
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
        const preferredLeague = team2Leagues.includes(league)
          ? league
          : team2Leagues[0];

        const url = buildComparisonUrl(
          teamName,
          compareTeam.trim(),
          league,
          preferredLeague,
        );
        navigate(url);
      } catch (error) {
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

      console.log(endpoint);

      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          // Handle array of team objects with players arrays
          if (Array.isArray(data) && data.length > 0 && data[0].players) {
            // Flatten all players from all teams
            const allPlayers = data.flatMap((teamObj) =>
              Array.isArray(teamObj.players) ? teamObj.players : [],
            );
            setTeamData({ playerEntrys: allPlayers });
          } else if (Array.isArray(data.players)) {
            setTeamData({ playerEntrys: data.players });
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
            setYearsData(Array.isArray(years) ? years : ["all"]);
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
          <h2 className="team-title">{teamName}</h2>
          <YearDropDown
            ref={selectorRef}
            years={Array.isArray(years) ? years : ["all"]}
            defaultYear={year}
            onYearChange={handleYearChange}
          />
        </div>
        <div className="center-section">
          <TeamSelectionBox
            placeholder="Compare to another team..."
            value={compareTeam}
            onChange={handleCompareTeamChange}
            showLeagueYearSelection={true}
            style={{ minWidth: 250 }}
          />
          <button onClick={handleCompare} className="compare-button enabled">
            Compare
          </button>
        </div>
        <div className="right-section">
          {/* Empty space for balanced layout */}
        </div>
      </div>
      <div className="table">
        <AgGridTable
          rowData={
            Array.isArray(teamData.playerEntrys) ? teamData.playerEntrys : []
          }
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
              headerName: "BIDs",
              field: "displayValue",
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
