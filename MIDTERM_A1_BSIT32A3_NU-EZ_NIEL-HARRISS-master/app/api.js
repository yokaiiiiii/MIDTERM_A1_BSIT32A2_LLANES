const BASE_URL = 'https://localhost:7273'; // Ensure this matches your backend server's URL

export const validateStudentNumber = async (studentNumber) => {
  try {
    const response = await fetch(`${BASE_URL}/api/GameResults/validate-player?studentNumber=${studentNumber}`);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Invalid student number.');
    }
    return true;
  } catch (error) {
    throw new Error(error.message || 'Error validating student number.');
  }
};

export const checkCooldown = async (studentNumber) => {
  try {
    const response = await fetch(`${BASE_URL}/api/GameResults/recent-players`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent players.');
    }

    const recentPlayers = await response.json();
    console.log('Recent players:', recentPlayers); // Debugging log

    // Filter all occurrences of the player
    const playerOccurrences = recentPlayers.filter(
      (player) => player.studentNumber.trim().toLowerCase() === studentNumber.trim().toLowerCase()
    );

    if (playerOccurrences.length === 0) {
      console.log('No recent plays found for this student.');
      return null; // No cooldown if no recent plays are found
    }

    // Find the most recent `datePlayed`
    const mostRecentPlayer = playerOccurrences.reduce((latest, current) =>
      new Date(latest.datePlayed) > new Date(current.datePlayed) ? latest : current
    );

    console.log('Most recent player:', mostRecentPlayer); // Debugging log

    const mostRecentDate = new Date(mostRecentPlayer.datePlayed);
    if (isNaN(mostRecentDate.getTime())) {
      console.error('Invalid date format for mostRecentDate:', mostRecentPlayer.datePlayed);
      throw new Error('Invalid date format received from the server.');
    }

    // Check if the most recent play is within the 3-hour cooldown period
    const cooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const now = Date.now();
    const timeDiff = now - mostRecentDate.getTime();

    if (timeDiff < cooldownDuration) {
      const remainingTime = cooldownDuration - timeDiff;
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      console.log(`Player is on cooldown. Remaining time: ${hours} hour(s) and ${minutes} minute(s).`);
      return `You can play again in ${hours} hour(s) and ${minutes} minute(s).`;
    }

    console.log('Cooldown expired. Player can play again.');
    return null; // Cooldown expired
  } catch (error) {
    console.error('Error checking cooldown:', error);
    return 'An error occurred while checking cooldown. Please try again later.';
  }
};

export const saveGameResult = async (studentNumber, outcome) => {
  try {
    const response = await fetch(`${BASE_URL}/api/GameResults/save-game`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: { studentNumber, name: '' }, // Pass an empty string for the Name field
        outcome,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error saving game result.');
    }
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};