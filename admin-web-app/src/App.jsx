import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlayersPage from "./pages/PlayersPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import SaveGamePage from "./pages/SaveGamePage";
import RecentPlayersPage from "./pages/RecentPlayersPage";
import PlayerManagementPage from "./pages/PlayerManagementPage"; 
import "./styles/global.css"; // Import global styles
import "./App.css"; // Import App-specific styles

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul className="nav-list">
            <li><a href="/" className="nav-link">Players</a></li>
            <li><a href="/audit-trail" className="nav-link">Audit Trail</a></li>
            <li><a href="/player-stats" className="nav-link">Player Stats</a></li>
            <li><a href="/save-game" className="nav-link">Save Game</a></li>
            <li><a href="/recent-players" className="nav-link">Recent Players</a></li>
            <li><a href="/player-management" className="nav-link">Player Management</a></li> 
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<PlayersPage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            <Route path="/player-stats" element={<PlayerStatsPage />} />
            <Route path="/save-game" element={<SaveGamePage />} />
            <Route path="/recent-players" element={<RecentPlayersPage />} />
            <Route path="/player-management" element={<PlayerManagementPage />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
