import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import PlayerTable from "./PlayerTable";
import PlayerRankingGraph from "./PlayerRankingGraph";
import "./PlayerPage.css";

const PlayerPage = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  let [mostRecentRanking, setMostRecentRanking] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, leagueName } = useParams();

  useEffect(() => {
    let endpoint = "";
    let graphEndpoint = "";
    if (username) {
      endpoint = `${API_BASE_URL}${ENDPOINTS.PLAYER}/${username}`;
      graphEndpoint = `${API_BASE_URL}${ENDPOINTS.GRAPH}/${username}`;
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
          setMostRecentRanking(data.length > 0 ? data[0].displayValue : 0);
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
    if (graphEndpoint) {
      fetch(graphEndpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((graphData) => {
          setGraphData(Array.isArray(graphData) ? graphData : []);
          setMostRecentRanking(
            graphData.length > 0 ? graphData[0].displayValue : 0,
          );
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
  }, [username, leagueName, mostRecentRanking]);

  if (loading) {
    return <div className="loading">Loading player data...</div>;
  }

  if (error) {
    return <div className="error">Error loading player data: {error}</div>;
  }

  return (
    <div className="PlayerPage">
      <div className="player-content">
        <h1>{username}</h1>
        <h2>
          {" "}
          BIDs: <u>{mostRecentRanking}</u>
        </h2>
        {leagueName && <h3>League: {leagueName}</h3>}
        <PlayerRankingGraph data={graphData} />
      </div>
      <div className="PlayerTable">
        <PlayerTable data={data} />
      </div>
    </div>
  );
};

export default PlayerPage;
