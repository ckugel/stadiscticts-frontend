import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';

const TeamTable = () => {
    const [teamData, setTeamData] = useState({ players: [] });
    const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'ascending'});
    const [compareInput, setCompareInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { teamName, year, league } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef();

    useEffect(() => {
        if (teamName) {
            let endpoint = `${API_BASE_URL}${ENDPOINTS.TEAM}/${teamName}`;
            if (year && year !== 'all') {
                endpoint += `/${year}`;
            }
            if (league) {
                endpoint += `?league=${league}`;
            }
            console.log(endpoint);
            fetch(endpoint)
                .then(response => response.json())
                .then(data => setTeamData(data))
                .catch(error => console.error('Error fetching team data:', error));
        }
    }, [teamName, league, year]);

    const sortedPlayers = [...teamData.players].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const getSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return '';
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleCompareInputChange = async (value) => {
        setCompareInput(value);
        setShowDropdown(true);
        if (value.length > 1) {
            try {
                const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${encodeURIComponent(value)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.teams || []);
                }
            } catch {
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectTeam = (team) => {
        setCompareInput(team.teamName);
        setShowDropdown(false);
        setSearchResults([]);
    };

    const handleCompareClick = () => {
        if (compareInput.trim()) {
            navigate(`/compare-teams?team1=${teamName}&team2=${compareInput.trim()}`);
        }
    };

    return (
        <div>
            <h2>Team: {teamName}</h2>
            <div style={{ marginBottom: 16, position: 'relative' }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Compare to another team..."
                    value={compareInput}
                    onChange={e => handleCompareInputChange(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    style={{ 
                        padding: 8, 
                        fontSize: 16, 
                        marginRight: 8,
                        color: '#000',
                        background: '#fff',
                        border: '1px solid #18e9ef',
                        borderRadius: 4,
                        minWidth: 200
                    }}
                    autoComplete="off"
                />
                {showDropdown && searchResults.length > 0 && (
                    <div style={{ 
                        position: 'absolute', 
                        top: 40, 
                        left: 0, 
                        zIndex: 10, 
                        background: '#fff', 
                        border: '1px solid #18e9ef', 
                        borderRadius: 4, 
                        width: '300px', 
                        maxHeight: 200, 
                        overflowY: 'auto' 
                    }}>
                        {searchResults.map((team, i) => (
                            <div 
                                key={i} 
                                onMouseDown={() => handleSelectTeam(team)} 
                                style={{ 
                                    cursor: 'pointer', 
                                    padding: '8px 12px', 
                                    borderBottom: i < searchResults.length - 1 ? '1px solid #eee' : 'none',
                                    color: '#000'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <div style={{ fontWeight: 'bold' }}>{team.teamName}</div>
                                {team.league && <div style={{ fontSize: '12px', color: '#888' }}>League: {team.league}</div>}
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={handleCompareClick}
                    style={{ 
                        padding: 8, 
                        fontSize: 16,
                        background: '#18e9ef',
                        color: '#074445',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    Compare
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>Player Name</th>
                    <th onClick={() => requestSort('year')}>
                        Year {getSortArrow('year')}
                    </th>
                    <th onClick={() => requestSort('rankingValue')}>
                        Ranking Value {getSortArrow('rankingValue')}
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedPlayers.map((player, index) => (
                    <tr key={index}>
                        <td>
                            <Link to={`/players/${player.name}`}>{player.name}</Link>
                        </td>
                        <td>{player.year}</td>
                        <td>{player.rankingValue}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamTable;
