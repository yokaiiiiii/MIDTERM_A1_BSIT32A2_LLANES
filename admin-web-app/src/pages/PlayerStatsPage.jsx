import React, { useEffect, useState, useCallback } from "react";
import { getPlayerStats } from "../services/api";

const PlayerStatsPage = () => {
  const [playerStats, setPlayerStats] = useState([]);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [error, setError] = useState(null);

  const fetchPlayerStats = useCallback(async () => {
    try {
      const data = await getPlayerStats(startDate || null, endDate || null); // Pass date range to API
      const sortedData = data.sort((a, b) => new Date(b.datePlayed) - new Date(a.datePlayed)); // Sort by most recent date
      setPlayerStats(sortedData);
    } catch (err) {
      console.error("Error fetching player stats:", err.message);
      setError(err.message);
    }
  }, [startDate, endDate]); // Dependencies: startDate and endDate

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]); // Include fetchPlayerStats in the dependency array

  const convertToPhilippineTime = (date) => {
    const options = { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleString("en-US", options);
  };

  return (
    <div>
      <h1>Player Statistics</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {/* Date Range Filter */}
      <div>
        <h2>Filter by Date Range</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <button onClick={fetchPlayerStats}>Apply Filter</button>
      </div>

      {/* Player Stats Table */}
      <div>
        <h2>Player Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Player ID</th>
              <th>Name</th>
              <th>Student Number</th>
              <th>Outcome</th>
              <th>Date Played (PHT)</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((stat) => (
              <tr key={`${stat.playerId}-${stat.datePlayed}`}>
                <td>{stat.playerId}</td>
                <td>{stat.playerName}</td>
                <td>{stat.studentNumber}</td>
                <td>{stat.outcome}</td>
                <td>{convertToPhilippineTime(stat.datePlayed)}</td> {/* Adjusted to PHT */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsPage;