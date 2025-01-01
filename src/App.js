import React, { useEffect, useState } from 'react';

const DataTable = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch('/api/tabledata')
			.then(response => response.json())
			.then(data => setData(data))
			.catch(error => console.error('Error fetching data:', error));
	}, []);

	return (
		<table>
			<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Value</th>
			</tr>
			</thead>
			<tbody>
			{data.map(item => (
				<tr key={item.id}>
					<td>{item.id}</td>
					<td>{item.name}</td>
					<td>{item.value}</td>
				</tr>
			))}
			</tbody>
		</table>
	);
};

export default DataTable;
