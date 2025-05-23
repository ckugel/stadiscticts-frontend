import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TeamComparisonBoxPlot from './TeamComparisonBoxPlot';
import Card from './Card';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';

const TeamComparisonSection = ({ options, theme }) => {
    const [teamInputs, setTeamInputs] = useState(['', '']);
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState([[], []]);
    const [showDropdown, setShowDropdown] = useState([false, false]);
    const location = useLocation();

    const inputRefs = [useRef(), useRef()];

    const handleInputChange = async (idx, value) => {
        const newInputs = [...teamInputs];
        newInputs[idx] = value;
        setTeamInputs(newInputs);
        setShowDropdown(drop => drop.map((d, i) => i === idx ? true : d));
        // Try to auto-complete using backend search
        if (value.length > 1) {
            try {
                const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${encodeURIComponent(value)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(results => results.map((r, i) => i === idx ? (data.teams || []) : r));
                }
            } catch {
                setSearchResults(results => results.map((r, i) => i === idx ? [] : r));
            }
        } else {
            setSearchResults(results => results.map((r, i) => i === idx ? [] : r));
        }
    };

    const fetchTeamData = async (teamName, idx) => {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.TEAM}/${teamName}`);
        if (!res.ok) throw new Error(`Failed to fetch team: ${teamName}`);
        const data = await res.json();
        // Try to get league from data, fallback to empty string
        return { name: teamName, players: data.players || [], league: data.league || (data.players && data.players[0] && data.players[0].league) || '' };
    };

    const handleCompare = async (inputs = teamInputs) => {
        setLoading(true);
        setError('');
        try {
            const results = await Promise.all(inputs.map((name, idx) => fetchTeamData(name, idx)));
            setTeamsData(results);
            // League check
            if (results.length === 2 && results[0].league && results[1].league && results[0].league !== results[1].league) {
                setError(`Warning: ${results[0].name} is in league '${results[0].league}', but ${results[1].name} is in league '${results[1].league}'. Please compare teams within the same league.`);
            }
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    const handleSelectTeam = (idx, team) => {
        const newInputs = [...teamInputs];
        newInputs[idx] = team.teamName;
        setTeamInputs(newInputs);
        setShowDropdown(drop => drop.map((d, i) => i === idx ? false : d));
        setSearchResults(results => results.map((r, i) => i === idx ? [] : r));
        if (inputRefs[idx + 1] && inputRefs[idx + 1].current) inputRefs[idx + 1].current.focus();
    };

    useEffect(() => {
        // Check for query params for team comparison
        const params = new URLSearchParams(location.search);
        const team1 = params.get('team1');
        const team2 = params.get('team2');
        if (team1 && team2) {
            setTeamInputs([team1, team2]);
            handleCompare([team1, team2]);
        }
    }, [location.search]);

    return (
        <section style={{ padding: 32 }}>
            <h2>Compare Teams</h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {teamInputs.map((input, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <input
                            ref={inputRefs[idx]}
                            type="text"
                            placeholder={`Team ${idx + 1} Name`}
                            value={input}
                            onChange={e => handleInputChange(idx, e.target.value)}
                            onFocus={() => setShowDropdown(drop => drop.map((d, i) => i === idx ? true : d))}
                            onBlur={() => setTimeout(() => setShowDropdown(drop => drop.map((d, i) => i === idx ? false : d)), 150)}
                            style={{ padding: 8, fontSize: 16, color: theme === 'dark' ? '#fff' : '#000', background: theme === 'dark' ? '#222' : '#fff', border: '1px solid #18e9ef', borderRadius: 4, minWidth: 180 }}
                            autoComplete="off"
                        />
                        {showDropdown[idx] && searchResults[idx].length > 0 && (
                            <div style={{ position: 'absolute', top: 40, left: 0, zIndex: 10, background: theme === 'dark' ? '#222' : '#fff', border: '1px solid #18e9ef', borderRadius: 4, width: '100%', maxHeight: 200, overflowY: 'auto' }}>
                                {searchResults[idx].map((team, i) => (
                                    <div key={i} onMouseDown={() => handleSelectTeam(idx, team)} style={{ cursor: 'pointer' }}>
                                        <Card name={team.teamName} link={null} league={team.league} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {teamsData[idx] && teamsData[idx].league && (
                            <span style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                League: {teamsData[idx].league}
                            </span>
                        )}
                    </div>
                ))}
                <button onClick={handleCompare} style={{ padding: 8, fontSize: 16, background: '#18e9ef', color: '#074445', border: 'none', borderRadius: 4 }}>Compare</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {teamsData.length === 2 && <TeamComparisonBoxPlot teams={teamsData} />}
        </section>
    );
};

export default TeamComparisonSection;
