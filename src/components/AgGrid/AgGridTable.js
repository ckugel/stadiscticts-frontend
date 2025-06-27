import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-grid.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import './AgGridTable.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTable = ({
    rowData,
    columnDefs,
    defaultColDef = {},
    onRowClicked,
    className = '',
    style = { height: 400, width: '100%' },
    ...props
}) => {
    return (
        <div className={`ag-theme-alpine ${className}`} style={style}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                    ...defaultColDef
                }}
                onRowClicked={onRowClicked}
                {...props}
            />
        </div>
    );
};

export default AgGridTable;
