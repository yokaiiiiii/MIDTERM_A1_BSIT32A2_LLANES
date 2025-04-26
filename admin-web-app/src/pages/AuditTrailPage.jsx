import React, { useEffect, useState } from "react";
import { getAuditTrail } from "../services/api";

const AuditTrailPage = () => {
  const [auditTrail, setAuditTrail] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      try {
        const data = await getAuditTrail("2025-01-01", "2025-12-31");
        console.log("Audit Trail Data:", data); // Log the API response
        setAuditTrail(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAuditTrail();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Audit Trail</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Played</th>
            <th>Outcome</th>
            <th>Student Number</th>
            <th>Player Name</th>
          </tr>
        </thead>
        <tbody>
          {auditTrail.map((result) => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{new Date(result.datePlayed).toLocaleString()}</td>
              <td>{result.outcome}</td>
              <td>{result.studentNumber || "N/A"}</td>
              <td>{result.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrailPage;