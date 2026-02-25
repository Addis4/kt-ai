"use client";

import { useEffect, useState } from "react";
import { fetchHome } from "./lib/api";

export default function HomePage() {
  const [home, setHome] = useState(null);

  useEffect(() => {
    fetchHome().then(setHome).catch(() => {});
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>KT.ai Project Onboarding</h1>
        <p>
          KT.ai guides developers through project onboarding using multi-agent
          knowledge transfer and governed tool access.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a className="button" href="/learning-path">
            Continue Learning Path
          </a>
          <a className="button secondary" href="/exploration">
            Explore Knowledge
          </a>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Detected User Context</h2>
          {home ? (
            <div className="list">
              <div>
                <strong>Name:</strong> {home.user.name}
              </div>
              <div>
                <strong>Role:</strong> {home.user.role}
              </div>
              <div>
                <strong>Team:</strong> {home.user.team}
              </div>
            </div>
          ) : (
            <p className="small">Loading user context...</p>
          )}
        </div>

        <div className="card">
          <h2>Active Project</h2>
          {home ? (
            <div className="list">
              <div className="badge">{home.project.key}</div>
              <div>
                <strong>{home.project.name}</strong>
              </div>
              <p>{home.project.description}</p>
              <p className="small">Session: {home.session_status}</p>
            </div>
          ) : (
            <p className="small">Loading project context...</p>
          )}
        </div>
      </div>
    </div>
  );
}
