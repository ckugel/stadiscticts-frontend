import React from 'react';
import DataTable from './components/DataTable';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Ulti Insights</h1>
			</header>
			<main>
				<DataTable/>
			</main>
		</div>
	);
}

export default App;