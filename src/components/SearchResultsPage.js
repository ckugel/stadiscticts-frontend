// src/components/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResultsPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const [searchResults, setSearchResults] = useState({ players: [], teams: [] });

    useEffect(() => {
        fetch(`http://localhost:8080/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                // Remove quotes from player names and filter out empty strings
                const players = data.players.map(player => player.replace(/"/g, '')).filter(player => player.trim() !== '');
                const teams = data.teams.map(team => team.replace(/"/g, '')).filter(team => team.trim() !== '' && team !== 'Team: ');
                setSearchResults({ players, teams });
            })
            .catch(error => console.error('Error fetching search results:', error));
    }, [query]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
            <div>
                {searchResults.players.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Players</h3>
                        <ul className="list-disc list-inside">
                            {searchResults.players.map((player, index) => (
                                <li key={index} className="mb-1">
                                    <Link to={`/players/${player}`}>{player}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {searchResults.teams.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Teams</h3>
                        <ul className="list-disc list-inside">
                            {searchResults.teams.map((team, index) => (
                                <li key={index} className="mb-1">
                                    <Link to={`/team/${team}`}>{team}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;