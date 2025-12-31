import React from "react";
import { AgGridReact } from "ag-grid-react";
import NoDataOverlay from "./NoDataOverlay.jsx";
// import "ag-grid-community/styles/ag-grid.css";
import {
  ModuleRegistry,
  themeBalham,
  AllCommunityModule,
} from "ag-grid-community";
import { myTheme } from "./ag-grid-theme-builder.jsx";

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTable = ({
  rowData,
  columnDefs,
  defaultColDef = {},
  onRowClicked,
  ...props
}) => {
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      theme={myTheme}
      noRowsOverlayComponent={NoDataOverlay}
      defaultColDef={{
        sortable: true,
        filter: true,
        resizable: true,
        ...defaultColDef,
      }}
      onRowClicked={onRowClicked}
      {...props}
    />
  );
};

export default AgGridTable;
