import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import PlayerPage from "./components/PlayerPage/PlayerPage";
import TeamTable from "./components/TeamPage/TeamTable";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResultsPage from "./components/SearchResultsPage";
import MainPage from "./components/MainPage/MainPage";
import TeamComparisonSection from "./components/TeamComparison/TeamComparisonSection";
import AboutPage from "./components/AboutPage/AboutPage";
import ContactPage from "./components/ContactPage/ContactPage";
import BidsScoresPage from "./components/BidsScoresPage/BidsScoresPage";
import { API_BASE_URL, ENDPOINTS } from "./constants/api";

function App() {
  const [options, setOptions] = useState({ players: [], teams: [] });

  const fetchOptions = (query = "") => {
    fetch(
      `${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`,
    )
      .then((response) => response.json())
      .then((data) => setOptions(data))
      .catch((error) => console.error("Error fetching search options:", error));
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
          <h1 className="text-3xl font-bold underline main-text">
            <Link to="/">BIDs</Link>
          </h1>
          <nav className="navigator">
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <Link to="/compare-teams" className="nav-link">
              Compare Teams
            </Link>
            <Link to="/BIDs-explained" className="nav-link">
              What are BIDs?
            </Link>
          </nav>
          <div className="flex items-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/players/:username" element={<PlayerPage />} />
            <Route
              path="/players/:username/:leagueName"
              element={<PlayerPage />}
            />
            <Route
              path="/team/:teamName/:year?/:league?"
              element={<TeamTable />}
            />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route
              path="/compare-teams"
              element={<TeamComparisonSection options={options} />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/BIDs-explained" element={<BidsScoresPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
