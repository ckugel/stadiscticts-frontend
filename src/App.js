import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PlayerTable from './components/PlayerPage/PlayerTable';
import TeamTable from "./components/TeamPage/TeamTable";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResultsPage from "./components/SearchResultsPage";
import MainPage from "./components/MainPage/MainPage";
import ThemeToggleButton from './components/ThemeToggleButton';
import TeamComparisonSection from "./components/TeamComparison/TeamComparisonSection";
import { API_BASE_URL, ENDPOINTS } from './constants/api';

function App() {
	const [options, setOptions] = useState({ players: [], teams: [] });
	const [theme, setTheme] = useState('dark');

	const fetchOptions = (query = '') => {
		fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`)
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
				<nav className="navigator">
					<Link to="/compare-teams" className="nav-link">
						Compare Teams
					</Link>
					<Link to="/about" className="nav-link">
						About Us
					</Link>
					<Link to="/contact" className="nav-link">
						Contact
					</Link>
					<Link to="/mmr-explained" className="nav-link">
						What is MMR?
					</Link>

				</nav>
				<main>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/players/:username" element={<PlayerTable />} />
						<Route path="/team/:teamName/:year?/:league?" element={<TeamTable theme={theme} />} />
						<Route path="/search" element={<SearchResultsPage />} />
						<Route path="/compare-teams" element={<TeamComparisonSection options={options} theme={theme} />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
