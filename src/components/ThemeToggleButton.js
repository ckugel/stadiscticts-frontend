import React from 'react';
import PropTypes from 'prop-types';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggleButton = ({ theme, toggleTheme }) => {
    return (
        <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
    );
};

ThemeToggleButton.propTypes = {
    theme: PropTypes.string.isRequired,
    toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggleButton;