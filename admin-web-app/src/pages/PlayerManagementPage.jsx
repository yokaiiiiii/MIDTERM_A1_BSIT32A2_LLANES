import React, { useEffect, useState } from "react";
import { getAllPlayers, registerPlayer, deletePlayer } from "../services/api"; // Removed updatePlayer import

const PlayerManagementPage = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: "", studentNumber: "" });
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

  const handleAddPlayer = async () => {
    try {
      const addedPlayer = await registerPlayer(newPlayer);
      setPlayers([...players, addedPlayer]);
      setNewPlayer({ name: "", studentNumber: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      console.log("Deleting player with ID:", id); // Log the ID being passed
      await deletePlayer(id);
      setPlayers(players.filter((p) => p.id !== id)); // Remove the player from the state
    } catch (err) {
      console.error("Error deleting player:", err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Player Management</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {/* Add Player Form */}
      <div>
        <h2>Add Player</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Student Number"
          value={newPlayer.studentNumber}
          onChange={(e) =>
            setNewPlayer({ ...newPlayer, studentNumber: e.target.value })
          }
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>

      {/* Player List */}
      <div>
        <h2>Players</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Student Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td>{player.studentNumber}</td>
                <td>
                  <button onClick={() => handleDeletePlayer(player.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerManagementPage;