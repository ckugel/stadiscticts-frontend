import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import "../AgGrid/AgGrid.css";
import AgGridTable from "../AgGrid/AgGridTable.js";

const PlayerTable = () => {
  const [data, setData] = useState({});
  const { username, leagueName } = useParams();

  useEffect(() => {
    let endpoint = "";
    if (username) {
      endpoint = `${API_BASE_URL}${ENDPOINTS.PLAYER}/${username}`;
    }

    if (leagueName) {
      endpoint += `/${leagueName}`;
    }

    if (endpoint) {
      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [username, leagueName]);

  return (
    <div className="TablePage">
      <div className="table">
        <AgGridTable
          rowData={Array.isArray(data) ? data : []}
          columnDefs={[
            {
              headerName: "Team",
              field: "team",
              cellRenderer: (params) => (
                <Link to={`/teams/${params.data.team}/${params.data.year}`}>
                  {params.data.team}
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
        ></AgGridTable>
      </div>
    </div>
  );
};

export default PlayerTable;
