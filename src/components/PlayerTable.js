import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const url = "http://localhost:8080";

const PlayerTable = () => {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'descending' });
    const { username, teamName, leagueName } = useParams();

    useEffect(() => {
        let endpoint = '';
        if (username) {
            endpoint = `${url}/player/${username}`;
        } else if (teamName) {
            endpoint = `${url}/team/${teamName}`;
        }

	if (leagueName) {
	    endpoint += `/${leagueName}`;
	}

        if (endpoint) {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [username, teamName, leagueName]);

    const sortedData = [...data].sort((a, b) => {
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
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th onClick={() => requestSort('year')}>
                    Year {getSortArrow('year')}
                </th>
                <th>Team</th>
                <th>Ranking Value</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((item, index) => (
                <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.year}</td>
                    <td><a href={`/team/${item.team}`}>{item.team}</a></td>
                    <td>{item.rankingValue}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default PlayerTable;
