"use client";

import { useEffect, useState } from "react";
import { fetchTracker } from "../lib/api";

export default function TrackerPage() {
  const [tracker, setTracker] = useState(null);

  useEffect(() => {
    fetchTracker().then(setTracker).catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1>Access Tracker</h1>
      <div className="card">
        <h2>Request Status</h2>
        {tracker ? (
          <div className="list">
            {tracker.requests.map((req) => (
              <div key={req.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{req.system}</strong>
                  <span className="badge">{req.status}</span>
                </div>
                <div className="small">{req.id}</div>
                <div className="small">Updated: {req.updated_at}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="small">Loading access requests...</p>
        )}
      </div>
    </div>
  );
}
