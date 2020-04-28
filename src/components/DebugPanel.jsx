import React from "react";

export default function DebugPanel({ playerStates }) {
  return <pre className="debugger">{JSON.stringify(playerStates, 0, 2)}</pre>;
}
