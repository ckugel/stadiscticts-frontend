import React from 'react';
import PlayerTable from './components/PlayerTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TeamTable from "./components/TeamTable";

function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<h1 className="text-3xl font-bold underline">SITE NAME</h1>
				</header>
				<main>
					<Routes>
						<Route path="/players/:username" element={<PlayerTable />} />
						<Route path="/team/:teamName/:year?" element={<TeamTable />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;