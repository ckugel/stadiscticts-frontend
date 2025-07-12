import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import AgGridTable from "../AgGrid/AgGridTable.js";
import CompareBox from "./CompareBox.js";
import "../AgGrid/AgGrid.css";

const TeamTable = () => {
  const [teamData, setTeamData] = useState({ players: [] });
  const [sortConfig, setSortConfig] = useState({
    key: "year",
    direction: "ascending",
  });
  const [compareInput, setCompareInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { teamName, year, league } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef();

  const availableYears = Array.from(
    new Set(teamData.players.map((p) => p.year)),
  ).sort((a, b) => a - b);
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    if (teamName) {
      let endpoint = `${API_BASE_URL}${ENDPOINTS.TEAM}/${teamName}`;
      if (year && year !== "all") {
        endpoint += `/${year}`;
      }
      if (league) {
        endpoint += `?league=${league}`;
      }

      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => setTeamData(data))
        .catch((error) => console.error("Error fetching team data:", error));
    }
  }, [teamName, league, year]);

  return (
    <div className="TablePage">
      <div className="aboveTable">
        <h2>Team: {teamName}</h2>
        <CompareBox
          teamName={teamName}
          year={year}
          league={league}
        ></CompareBox>
      </div>
      <div className="table">
        <AgGridTable
          rowData={Array.isArray(teamData.players) ? teamData.players : []}
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
        />
      </div>
    </div>
  );
};

export default TeamTable;
