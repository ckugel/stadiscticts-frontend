import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const url = "http://localhost:8080";

const TeamTable = () => {
    const [teamData, setTeamData] = useState({ players: []});
    const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'ascending' });
    const { teamName, year } = useParams();

    useEffect(() => {
        if (teamName) {
            let endpoint = `${url}/team/${teamName}`;
            if (year) {
                endpoint += `/${year}`;
            }
            console.log(endpoint);
            fetch(endpoint)
                .then(response => response.json())
                .then(data => setTeamData(data))
                .catch(error => console.error('Error fetching team data:', error));
        }
    }, [teamName, year]);

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

    return (
        <div>
            <h2>Team: {teamName}</h2>
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
                        <td>{player.name}</td>
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