import React, { useEffect, useState } from "react";
import { getAllPlayers, searchPlayers } from "../services/api";

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlayers();
  }, []);

  const handleSearch = async () => {
    try {
      const data = await searchPlayers(searchTerm);
      setPlayers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Players</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Number</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.studentNumber}</td>
              <td>{player.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersPage;