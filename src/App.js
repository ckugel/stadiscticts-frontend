// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PlayerTable from './components/PlayerTable';
import TeamTable from "./components/TeamTable";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResultsPage from "./components/SearchResultsPage";

function App() {
	const [options, setOptions] = useState({ players: [], teams: [] });

	const fetchOptions = (query = '') => {
		fetch(`http://localhost:8080/search?q=${query}`)
			.then(response => response.json())
			.then(data => setOptions(data))
			.catch(error => console.error('Error fetching search options:', error));
	};

	useEffect(() => {
		fetchOptions();
	}, []);

	const handleSearch = (query) => {
		fetchOptions(query);
	};

	return (
		<Router>
			<div className="App">
				<header className="App-header flex justify-between items-center p-4">
					<h1 className="text-3xl font-bold underline">SITE NAME</h1>
					<SearchBar onSearch={handleSearch} />
				</header>
				<main>
					<Routes>
						<Route path="/players/:username" element={<PlayerTable />} />
						<Route path="/team/:teamName/:year?" element={<TeamTable />} />
						<Route path="/search" element={<SearchResultsPage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;