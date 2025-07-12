import React, { useState, useImperativeHandle, forwardRef } from "react";

const YearDropDown = forwardRef(({ years, onYearChange }, ref) => {
  const [selectedYear, setSelectedYear] = useState(years[0]);

  useImperativeHandle(ref, () => ({
    getSelectedYear: () => selectedYear,
  }));

  const handleChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    if (onYearChange) {
      onYearChange(newYear);
    }
  };

  return (
    <div className="yearDrop">
      <label htmlFor="year-select">Select Year: </label>
      <select
        id="year-select"
        value={selectedYear}
        style={{ color: "black", padding: "3px" }}
        onChange={handleChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
});

export default YearDropDown;
