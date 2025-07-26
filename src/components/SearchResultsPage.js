import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "./Cards/Card";
import { API_BASE_URL, ENDPOINTS } from "../constants/api";
import { getDisplayLeagueName } from "../utils/leagueUtils";

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [searchResults, setSearchResults] = useState({
    players: [],
    teams: [],
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}${ENDPOINTS.SEARCH}?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const players = data.players
          .map((player) => player.replace(/"/g, ""))
          .filter((player) => player.trim() !== "");
        const teams = data.teams
          .filter((team) => team.teamName && team.teamName.trim() !== "")
          .map((team) => ({
            teamName: team.teamName.replace(/"/g, ""),
            year: team.year,
            league: team.league,
          }));
        setSearchResults({ players, teams });
      })
      .catch((error) => console.error("Error fetching search results:", error));
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      <div>
        {searchResults.players.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Players</h3>
            {searchResults.players.map((player, index) => (
              <Card key={index} name={player} link={`/players/${player}`} />
            ))}
          </div>
        )}
        {searchResults.teams.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Teams</h3>
            {searchResults.teams.map((team, index) => (
              <Card
                key={index}
                name={`${team.teamName}`}
                link={`/team/${team.teamName}/all/${team.league}`}
                league={getDisplayLeagueName(team.league)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
