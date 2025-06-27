
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
        <div className={`ag-theme-alpine custom-aggrid dark-mode ${className}`} style={style}>
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
