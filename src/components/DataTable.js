import React, { useEffect, useState } from 'react';

const DataTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/player/Will Brandt')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Ranking Value</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.team}</td>
                    <td>{item.rankingValue}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DataTable;