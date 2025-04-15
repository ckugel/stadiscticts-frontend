import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        onSearch(query);
        navigate(`/search?query=${query}`);
    };

    const handeKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={"search-bar"}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handeKeyPress}
                placeholder="Search for players or teams"
            />
            <button className="search-button" onClick={handleSearch}><p> Search</p></button>
        </div>
    );
};

export default SearchBar;
