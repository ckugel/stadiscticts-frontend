import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const url = "http://localhost:8080";

const PlayerTable = () => {
    const [data, setData] = useState([]);
    const { username, teamName } = useParams();

    useEffect(() => {
        let endpoint = '';
        if (username) {
            endpoint = `${url}/player/${username}`;
        } else if (teamName) {
            endpoint = `${url}/team/${teamName}`;
        }

        if (endpoint) {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [username, teamName]);

    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Year</th>
                <th>Team</th>
                <th>Ranking Value</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
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