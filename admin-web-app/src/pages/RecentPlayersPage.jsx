import React, { useEffect, useState } from "react";
import { getRecentPlayers } from "../services/api";

const RecentPlayersPage = () => {
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPlayers = async () => {
      try {
        const data = await getRecentPlayers();
        setRecentPlayers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecentPlayers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Recent Players</h1>
      <table>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Date Played</th>
          </tr>
        </thead>
        <tbody>
          {recentPlayers.map((player, index) => (
            <tr key={index}>
              <td>{player.studentNumber}</td>
              <td>{player.name}</td>
              <td>{new Date(player.datePlayed).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentPlayersPage;