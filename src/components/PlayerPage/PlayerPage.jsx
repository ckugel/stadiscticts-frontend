import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, ENDPOINTS } from "../../constants/api";
import PlayerTable from "./PlayerTable";
import PlayerRankingGraph from "./PlayerRankingGraph";
import "./PlayerPage.css";

const PlayerPage = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [mostRecentRanking, setMostRecentRanking] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username, leagueName } = useParams();

   useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError(null);

    // Build endpoints
    let endpoint = `${API_BASE_URL}${ENDPOINTS.PLAYER}/${username}`;
    let graphEndpoint = `${API_BASE_URL}${ENDPOINTS.GRAPH}/${username}`;
    if (leagueName) {
      endpoint += `/${leagueName}`;
    }

    // Fetch both in parallel, wait for both to settle before updating UI
    const fetchPlayer = fetch(endpoint).then((res) => {
      if (!res.ok) throw new Error(`Player endpoint error: ${res.status}`);
      return res.json();
    });

    const fetchGraph = fetch(graphEndpoint).then((res) => {
      if (!res.ok) throw new Error(`Graph endpoint error: ${res.status}`);
      return res.json();
    });

    Promise.allSettled([fetchPlayer, fetchGraph])
      .then((results) => {
        // Player data
        if (results[0].status === "fulfilled") {
          const playerData = Array.isArray(results[0].value)
            ? results[0].value
            : [];
          setData(playerData);
        } else {
          console.error("Player fetch failed:", results[0].reason);
        }

        // Graph data
        if (results[1].status === "fulfilled") {
          const gData = Array.isArray(results[1].value)
            ? results[1].value
            : [];
          setGraphData(gData);
        } else {
          console.error("Graph fetch failed:", results[1].reason);
        }

        // Decide mostRecentRanking in one place (choose the most recent by year if possible)
        const pickMostRecent = (arr) => {
          if (!arr || arr.length === 0) return null;
          // prefer item with max yearValueTwo (fallback to index 0 if not present)
          const withYear = arr.filter((i) => i.yearValueTwo !== undefined && i.yearValueTwo !== null);
          if (withYear.length > 0) {
            const latest = withYear.reduce((a, b) => (a.yearValueTwo > b.yearValueTwo ? a : b));
            return latest.displayValue ?? latest.rankingValue ?? null;
          }
          return arr[0].displayValue ?? arr[0].rankingValue ?? null;
        };

        const fromPlayer = pickMostRecent(results[0].status === "fulfilled" ? results[0].value : []);
        const fromGraph = pickMostRecent(results[1].status === "fulfilled" ? results[1].value : []);

        // Prefer player response; fall back to graph response if not available
        const chosen =
          fromPlayer !== null && fromPlayer !== undefined
            ? fromPlayer
            : fromGraph !== null && fromGraph !== undefined
            ? fromGraph
            : 0;

        setMostRecentRanking(Number(chosen) || 0);
      })
      .catch((err) => {
        console.error("Unexpected error fetching player data:", err);
        setError(err.message || String(err));
      })
      .finally(() => {
        setLoading(false); // wait until both done
      });
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
