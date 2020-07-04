import React from "react";
import _ from "lodash";

function Stats(props) {
  const { stats, rounds, total } = props;

  const orderedPlayerStats = Object.keys(stats)
    .map((playerId) => stats[playerId])
    .sort((a, b) => b.wins - a.wins);

  return (
    <div className="stats">
      <div
        style={{
          textAlign: "center",
          padding: "0.25rem 0 0.5rem",
          color: "#2ecc71",
        }}>
        Round {rounds} of {total}
      </div>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th style={{ padding: 0 }}></th>
            <th style={{ textAlign: "right" }}>Wins</th>
          </tr>
        </thead>
        <tbody>
          {_.map(orderedPlayerStats, (playerStats, index) => {
            return (
              <tr key={index} className={`player-stats ${playerStats.isAlive ? "" : "-dead"}`}>
                <td className="player-name">{playerStats.name}</td>
                <td style={{ padding: 0 }} className="player-dead-emoji">
                  <span role="img" aria-label="dead">
                    💀
                  </span>
                </td>
                <td className="stats-results">{playerStats.wins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
