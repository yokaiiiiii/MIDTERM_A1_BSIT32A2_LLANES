import React from "react";
import ReactDOM from "react-dom/client"; // Use the new ReactDOM API
import App from "./App";
import "./styles/global.css";

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);