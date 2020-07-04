import React from "react";
import _ from "lodash";

var DIRECTIONS = ["north", "east", "south", "west"];

function Players(props) {
  const [playerDirections, setPlayerDirections] = React.useState(
    props.playerStates.map((el) => DIRECTIONS.indexOf(el.direction))
  );

  // every time that the player state changes we need to update the direction
  React.useEffect(() => {
    const newPlayerDirections = props.playerStates.map((el) => DIRECTIONS.indexOf(el.direction));

    setPlayerDirections(
      newPlayerDirections.map((el, index) => {
        let directionDifference = ((el + 4) % 4) - ((playerDirections[index] + 4) % 4);
        if (directionDifference === 3) directionDifference = -1;
        if (directionDifference === -3) directionDifference = 1;

        return playerDirections[index] + directionDifference;
      })
    );
  }, [props]);

  const { gridSize, playerStates, playerInstances } = props;

  const tileSize = 100 / gridSize;

  const playerRender = _.map(playerStates, (playerData, playerIndex) => {
    if (!playerData.isAlive) return null;

    const playerInfo = playerInstances[playerIndex].getInfo();

    return (
      <div
        key={playerIndex}
        className="clash-player-container"
        style={{
          width: tileSize + "vmin",
          height: tileSize + "vmin",
          transform:
            "translateY(" +
            tileSize * playerData.position[0] +
            "vmin) " +
            "translateX(" +
            tileSize * playerData.position[1] +
            "vmin)",
        }}>
        <div
          className="clash-player"
          style={{
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            backgroundImage: "url(static/rockets/rocket" + (playerData.style || 0) + ".png)",
            transform: "scale(1.25) " + "rotate(" + 90 * playerDirections[playerIndex] + "deg) ",
          }}
        />
        <div className="clash-player-name">{playerInfo.name}</div>
      </div>
    );
  });

  return <div className="clash-layer">{playerRender}</div>;
}

export default Players;
