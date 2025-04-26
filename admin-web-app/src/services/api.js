const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7273/api";

/**
 * Fetch audit trail data.
 * @param {string} startDate - Start date in ISO format.
 * @param {string} endDate - End date in ISO format.
 * @returns {Promise<any>} - Audit trail data.
 */
export async function getAuditTrail(startDate, endDate) {
  const url = `${API_BASE_URL}/gameresults/audit-trail?startDate=${startDate}&endDate=${endDate}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching audit trail: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch player stats.
 * @param {string} startDate - Start date in ISO format.
 * @param {string} endDate - End date in ISO format.
 * @returns {Promise<any>} - Player stats data.
 */
export async function getPlayerStats(startDate, endDate) {
  let url = `${API_BASE_URL}/gameresults/player-stats`;

  // Dynamically add query parameters if they are provided
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from backend:", errorText);
    throw new Error(`Error fetching player stats: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Validate a player by student number.
 * @param {string} studentNumber - The student number to validate.
 * @returns {Promise<any>} - Validation result.
 */
export async function validatePlayer(studentNumber) {
  const url = `${API_BASE_URL}/gameresults/validate-player?studentNumber=${studentNumber}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error validating player: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch recent players.
 * @returns {Promise<any>} - Recent players data.
 */
export async function getRecentPlayers() {
  const url = `${API_BASE_URL}/gameresults/recent-players`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching recent players: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Save a game result.
 * @param {Object} gameResult - The game result object to save.
 * @returns {Promise<any>} - Save result.
 */
export async function saveGame(gameResult) {
  const url = `${API_BASE_URL}/gameresults/save-game`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameResult), 
  });

  if (!response.ok) {
    // Log the response for debugging
    const errorText = await response.text();
    console.error("Error response from backend:", errorText);
    throw new Error(`Error saving game: ${response.statusText}`);
  }

  return response.json(); // Ensure the response is parsed as JSON
}

/**
 * Register a new player.
 * @param {Object} player - The player object to register (e.g., { name, studentNumber }).
 * @returns {Promise<any>} - Registered player data.
 */
export async function registerPlayer(player) {
  const url = `${API_BASE_URL}/players/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });
  if (!response.ok) {
    throw new Error(`Error registering player: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all players.
 * @returns {Promise<any>} - List of all players.
 */
export async function getAllPlayers() {
  const url = `${API_BASE_URL}/players`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching players: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch a player by ID.
 * @param {number} id - The ID of the player to fetch.
 * @returns {Promise<any>} - Player data.
 */
export async function getPlayerById(id) {
  const url = `${API_BASE_URL}/players/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching player by ID: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update a player's information.
 * @param {number} id - The ID of the player to update.
 * @param {Object} updatedPlayer - The updated player data (e.g., { name }).
 * @returns {Promise<any>} - Update result.
 */
export async function updatePlayer(id, updatedPlayer) {
  const url = `${API_BASE_URL}/players/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPlayer),
  });
  if (!response.ok) {
    throw new Error(`Error updating player: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Delete a player by ID.
 * @param {number} playerId - The ID of the player to delete.
 * @returns {Promise<any>} - Deletion result.
 */
export async function deletePlayer(playerId) {
  const url = `${API_BASE_URL}/players/${playerId}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from backend:", errorText);
    throw new Error(errorText); // Throw the error message from the backend
  }

  return response.json(); // Parse and return the JSON response
}

/**
 * Search players by name.
 * @param {string} name - The name to search for.
 * @returns {Promise<any>} - List of players matching the search.
 */
export async function searchPlayers(name) {
  const url = `${API_BASE_URL}/players/search?name=${encodeURIComponent(name)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error searching players: ${response.statusText}`);
  }
  return response.json();
};