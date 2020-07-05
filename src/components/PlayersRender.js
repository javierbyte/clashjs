import React from "react";
import _ from "lodash";

function PlayersRender(props) {
  const { gridSize, playerStates, playerInstances, speed } = props;
  const playerDirections = playerStates.map((el) => el.directionAngle);
  const tileSize = 100 / gridSize;

  const playerRender = _.map(playerStates, (playerData, playerIndex) => {
    const playerUUID = playerData.id;
    const playerInfo = playerInstances.find((player) => player.id === playerUUID).info;

    return (
      <div
        key={playerIndex}
        className="clash-player-container"
        style={{
          transition: `transform ${speed * 2 + 16}ms`,
          width: tileSize + "vmin",
          height: tileSize + "vmin",
          opacity: playerData.isAlive ? 1 : 0.5,
          zIndex: playerData.isAlive ? 2 : 0,
          transform: `translateY(${tileSize * playerData.position[0]}vmin) translateX(${
            tileSize * playerData.position[1]
          }vmin) scale(${playerData.isAlive ? 1.25 : 0.75})`,
        }}>
        <div
          className={`clash-player -name-${playerData.name}`}
          style={{
            transition: `transform ${speed * 2 + 16}ms`,
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            filter: `grayscale(${playerData.isAlive ? "0%" : "100%"})`,
            backgroundImage: "url(static/rockets/rocket" + (playerData.style || 0) + ".png)",
            // transform: "scale(1.25) " + "rotate(" + 90 * playerDirections[playerIndex] + "deg) ",
            transform: `rotate(${
              90 * playerDirections[playerIndex] + (playerData.isAlive ? 0 : 45)
            }deg)`,
          }}
        />
        <div
          className="clash-player-name"
          style={{ textDecoration: playerData.isAlive ? "none" : "line-through" }}>
          {playerInfo.name}
          {new Array(Math.min(playerData.ammo, 3)).fill("🚀").join("")}
        </div>
      </div>
    );
  });

  return <div className="clash-layer">{playerRender}</div>;
}

export default PlayersRender;
