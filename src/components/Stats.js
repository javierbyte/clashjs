import React from "react";
import _ from "lodash";

function Stats(props) {
  const { gameStats, rounds, total } = props;

  const orderedStats = Object.keys(gameStats)
    .map((playerId) => {
      {
        return { ...gameStats[playerId], id: playerId };
      }
    })
    .sort((a, b) => b.score - a.score);

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
            <th alt="Eliminations" style={{ textAlign: "right" }}>
              E
            </th>
            <th alt="Wins" style={{ textAlign: "right" }}>
              W
            </th>
            <th alt="Score" style={{ textAlign: "right" }}>
              S
            </th>
          </tr>
        </thead>
        <tbody>
          {_.map(orderedStats, (playerStats, index) => {
            return (
              <tr key={index} className={`player-stats ${playerStats.isAlive ? "" : "-dead"}`}>
                <td className="player-name">{playerStats.name}</td>
                <td style={{ padding: 0 }} className="player-dead-emoji">
                  <span role="img" aria-label="dead">
                    💀
                  </span>
                </td>
                <td className="stats-results">{playerStats.kills}</td>
                <td className="stats-results">{playerStats.wins}</td>
                <td className="stats-results">{playerStats.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
