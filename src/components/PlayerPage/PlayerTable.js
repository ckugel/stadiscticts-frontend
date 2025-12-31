import React from "react";
import { Link } from "react-router-dom";
import { getLeagueDisplayName } from "../../utils/leagueUtils";
import "../AgGrid/AgGrid.css";
import AgGridTable from "../AgGrid/AgGridTable.js";

const PlayerTable = ({ data }) => {
  return (
    <div className="table">
      <AgGridTable
        rowData={data || []}
        columnDefs={[
          {
            headerName: "Team",
            field: "team",
            cellRenderer: (params) => (
              <Link
                to={`/team/${params.data.team}/${params.data.year}/${params.data.league}`}
              >
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
            headerName: "League",
            field: "league",
            cellRenderer: (params) => getLeagueDisplayName(params.data.league),
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
      ></AgGridTable>
    </div>
  );
};

export default PlayerTable;
