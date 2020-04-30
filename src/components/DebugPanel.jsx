import React from "react";

export default function DebugPanel({ playerStates }) {
  return <pre className="debug-panel">{JSON.stringify(playerStates, 0, 2)}</pre>;
}
