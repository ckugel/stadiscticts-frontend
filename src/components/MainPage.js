// src/components/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div className="main-page">
            <header className="App-header">
                <h1>Welcome to SITE NAME</h1>
            </header>
            <main>
                <p>Explore players and teams:</p>
                <nav>
                    <ul>
                        <li><Link to="/players">Players</Link></li>
                        <li><Link to="/teams">Teams</Link></li>
                    </ul>
                </nav>
            </main>
        </div>
    );
};

export default MainPage;