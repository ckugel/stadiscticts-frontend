import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar/SearchBar';

const Header = ({ showSidebarButton = true, onShowSidebar, onSearch }) => {
    return (
        <div style={{ backgroundColor: '#151515', padding: '16px', color: 'white', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ flex: 1 }}>
                {showSidebarButton && (
                    <button onClick={onShowSidebar} style={{ color: 'white', border: '1px solid white', padding: '8px' }}>
                        {'>'}
                    </button>
                )}
            </div>
            {!showSidebarButton && (
                <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
                    <span style={{ fontSize: '16px', marginRight: '20px' }}>About Us</span>
                    <span style={{ fontSize: '16px', marginRight: '20px' }}>Contact</span>
                    <span style={{ fontSize: '16px', marginRight: '20px' }}>Terms</span>
                </div>
            )}
            <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', justifyContent: 'center', height: '20px' }}>
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