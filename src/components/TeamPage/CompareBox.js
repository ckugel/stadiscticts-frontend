import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CompareBox = () => {
    const navigate = useNavigate();
    const inputRef = useRef();
    const [compareInput, setCompareInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { teamName } = useParams();

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
	</div>
    );

};
	export default CompareBox;
