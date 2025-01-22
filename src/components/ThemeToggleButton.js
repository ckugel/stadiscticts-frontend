// src/components/ThemeToggleButton.js
import React from 'react';

const ThemeToggleButton = ({ theme, toggleTheme }) => {
    return (
        <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
    );
};

export default ThemeToggleButton;