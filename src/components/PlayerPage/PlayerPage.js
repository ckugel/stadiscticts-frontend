import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import PlayerTable from "./PlayerTable";
import PlayerRankingGraph from "./PlayerRankingGraph";

const PlayerPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, leagueName } = useParams();

  useEffect(() => {
    let endpoint = "";
    if (username) {
      endpoint = `${API_BASE_URL}${ENDPOINTS.PLAYER}/${username}`;
    }

    if (leagueName) {
      endpoint += `/${leagueName}`;
    }

    if (endpoint) {
      setLoading(true);
      fetch(endpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setData(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username, leagueName]);

  if (loading) {
    return <div className="loading">Loading player data...</div>;
  }

  if (error) {
    return <div className="error">Error loading player data: {error}</div>;
  }

  return (
    <div className="PlayerPage">
      <div className="player-content">
        <h1>Player: {username}</h1>
        {leagueName && <h2>League: {leagueName}</h2>}

        <div className="player-graph-section">
          <PlayerRankingGraph data={data} />
        </div>

        <div className="player-table-section">
          <PlayerTable data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
