import React from "react";
import _ from "lodash";

const DIRECTIONS = ["north", "east", "south", "west"];

function Players(props) {
  const { gridSize, playerStates, playerInstances, speed } = props;

  const playerDirections = playerStates.map((el) => el.directionAngle);

  // const [playerDirections, setPlayerDirections] = React.useState(
  //   props.playerStates.map((el) => DIRECTIONS.indexOf(el.direction))
  // );

  // // every time that the player state changes we need to update the direction
  // React.useEffect(() => {
  //   const newPlayerDirections = playerStates.map((el) => DIRECTIONS.indexOf(el.direction));

  //   setPlayerDirections(
  //     newPlayerDirections.map((el, index) => {
  //       let directionDifference = ((el + 4) % 4) - ((playerDirections[index] + 4) % 4);
  //       if (directionDifference === 3) directionDifference = -1;
  //       if (directionDifference === -3) directionDifference = 1;

  //       return playerDirections[index] + directionDifference;
  //     })
  //   );
  // });

  const tileSize = 100 / gridSize;

  const playerRender = _.map(playerStates, (playerData, playerIndex) => {
    // if (!playerData.isAlive) return null;

    const playerInfo = playerInstances[playerIndex].getInfo();

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
          className="clash-player"
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
        </div>
      </div>
    );
  });

  return <div className="clash-layer">{playerRender}</div>;
}

export default Players;
