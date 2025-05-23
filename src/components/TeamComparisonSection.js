import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TeamComparisonBoxPlot from './TeamComparisonBoxPlot';

const TeamComparisonSection = () => {
    const [teamInputs, setTeamInputs] = useState(['', '']);
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();

    const handleInputChange = (idx, value) => {
        const newInputs = [...teamInputs];
        newInputs[idx] = value;
        setTeamInputs(newInputs);
    };

    const fetchTeamData = async (teamName, idx) => {
        const res = await fetch(`/team/${teamName}`);
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
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <input
                            type="text"
                            placeholder={`Team ${idx + 1} Name`}
                            value={input}
                            onChange={e => handleInputChange(idx, e.target.value)}
                            style={{ padding: 8, fontSize: 16 }}
                        />
                        {teamsData[idx] && teamsData[idx].league && (
                            <span style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                League: {teamsData[idx].league}
                            </span>
                        )}
                    </div>
                ))}
                <button onClick={handleCompare} style={{ padding: 8, fontSize: 16 }}>Compare</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {teamsData.length === 2 && <TeamComparisonBoxPlot teams={teamsData} />}
        </section>
    );
};

export default TeamComparisonSection;
