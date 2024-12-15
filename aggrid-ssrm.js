import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ServerSideAgGrid = () => {
  const gridRef = useRef(null);

  // Define column definitions
  const columnDefs = [
    { field: 'id', headerName: 'ID', sortable: true },
    { field: 'name', headerName: 'Name', sortable: true, rowGroup: true },
    { field: 'age', headerName: 'Age', sortable: true, aggFunc: 'avg' },
    { field: 'email', headerName: 'Email', sortable: true },
  ];

  // Default column definitions
  const defaultColDef = {
    flex: 1,
    resizable: true,
    enableRowGroup: true, // Allow grouping by columns
    enablePivot: true, // Allow pivoting by columns
    enableValue: true, // Allow aggregation on columns
  };

  // Fetch data from a mock server endpoint
  const fetchServerData = async (params) => {
    const { startRow, endRow, rowGroupCols, groupKeys, valueCols, pivotCols, sortModel } = params.request;

    // Replace this with your API endpoint
    const response = await fetch(`https://mockapi.example.com/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startRow, endRow, rowGroupCols, groupKeys, valueCols, pivotCols, sortModel })
    });
    const result = await response.json();

    const rowsThisPage = result.data;
    const lastRow = result.total;

    return { rows: rowsThisPage, lastRow };
  };

  // Data source for the grid
  const dataSource = {
    getRows: async (params) => {
      console.log('Server request params:', params.request);
      const response = await fetchServerData(params);
      params.successCallback(response.rows, response.lastRow);
    },
  };

  // Initialize grid when ready
  const onGridReady = (params) => {
    gridRef.current.api.setServerSideDatasource(dataSource);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowModelType="serverSide"
        serverSideStoreType="full" // Allows lazy-loading of groups
        cacheBlockSize={100} // Number of rows per block
        animateRows={true}
        enableRangeSelection={true}
        suppressAggFuncInHeader={true}
        onGridReady={onGridReady}
        groupUseEntireRow={true} // Show group information in one row
      />
    </div>
  );
};

export default ServerSideAgGrid;
