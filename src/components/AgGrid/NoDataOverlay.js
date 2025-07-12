import React from "react";

export default (props) => {
  return (
    <div
      role="presentation"
      className="ag-overlay-loading-center"
      style={{ backgroundColor: "#b4bebe", height: "40%" }}
    >
      <p className="NoData">No data at this time</p>
    </div>
  );
};
