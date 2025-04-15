import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PlayerTable from './components/PlayerTable';
import TeamTable from "./components/TeamTable";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResultsPage from "./components/SearchResultsPage";
import MainPage from "./components/MainPage";
import ThemeToggleButton from './components/ThemeToggleButton';

const FETCH_URL = 'http://localhost:8080';

function App() {
	const [options, setOptions] = useState({ players: [], teams: [] });
	const [theme, setTheme] = useState('dark');

	const fetchOptions = (query = '') => {
		fetch(FETCH_URL + `/search?q=${query}`)
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

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	useEffect(() => {
		document.body.className = theme;
	}, [theme]);

	return (
		<Router>
			<div className={`App ${theme}`}>
				<header className="App-header flex justify-between items-center p-4">
					<h1 className="text-3xl font-bold underline"><Link to = "/" >Sta<u><i>disc</i></u>ticts</Link></h1>
					<div className="flex items-center">
						<SearchBar onSearch={handleSearch} />
						<ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
					</div>
				</header>
				<main>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/players/:username" element={<PlayerTable />} />
						<Route path="/team/:teamName/:year?/:league?" element={<TeamTable />} />
						<Route path="/search" element={<SearchResultsPage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
