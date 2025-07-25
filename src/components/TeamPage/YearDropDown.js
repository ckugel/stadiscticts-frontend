import React, { useState, useImperativeHandle, forwardRef } from "react";
import "./YearDropDown.css";

const YearDropDown = forwardRef(
  ({ years, defaultYear, onYearChange, theme = "light" }, ref) => {
    const [selectedYear, setSelectedYear] = useState(defaultYear);

    useImperativeHandle(ref, () => ({
      getSelectedYear: () => selectedYear,
    }));

    const handleChange = (e) => {
      const newYear = e.target.value;
      setSelectedYear(newYear);
      if (onYearChange) {
        onYearChange(newYear);
      }
    };

    return (
      <div className="year-dropdown">
        <label htmlFor="year-select" className={`year-dropdown-label ${theme}`}>
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          className={`year-dropdown-select ${theme}`}
          onChange={handleChange}
        >
          {years.map((year) => (
            <option
              key={year}
              value={year}
              className={`year-dropdown-option ${theme}`}
            >
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default YearDropDown;
