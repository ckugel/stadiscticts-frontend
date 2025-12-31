import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar/SearchBar';
import '../../App.css';
import './Header.css';

const Header = ({ showSidebarButton = true, onShowSidebar, onSearch }) => {
    return (
        <div className="header-container">
            <div className="header-search">
                <SearchBar onSearch={onSearch} />
            </div>
        </div>
    );
};

Header.propTypes = {
    showSidebarButton: PropTypes.bool,
    onShowSidebar: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default Header;
