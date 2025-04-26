import React, { useState } from "react";
import { saveGame } from "../services/api";

const SaveGamePage = () => {
  const [gameResult, setGameResult] = useState({
    player: { studentNumber: "", name: "" }, // Use an empty string for Name
    outcome: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Game Result:", gameResult); // Log the payload
    try {
      await saveGame(gameResult);
      setMessage("Game result saved successfully!");
      setError(null);
    } catch (err) {
      console.error("Error saving game:", err.message); // Log the error
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Save Game Result</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Number:</label>
          <input
            type="text"
            value={gameResult.player.studentNumber}
            onChange={(e) =>
              setGameResult({
                ...gameResult,
                player: { ...gameResult.player, studentNumber: e.target.value },
              })
            }
          />
        </div>
        <div>
          <label>Outcome:</label>
          <select
            value={gameResult.outcome}
            onChange={(e) =>
              setGameResult({ ...gameResult, outcome: e.target.value })
            }
          >
            <option value="">Select Outcome</option>
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
      {message && <div>{message}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default SaveGamePage;