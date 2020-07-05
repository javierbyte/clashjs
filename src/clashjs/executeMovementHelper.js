const _ = require("lodash");
const utils = require("../lib/utils.js");
const DIRECTIONS = ["north", "east", "south", "west"];

const safeMovement = (value, size) => {
  if (value < 0) return 0;
  if (value > size - 1) return size - 1;
  return value;
};

const clashCoreUtils = (data) => {
  const {
    playerIndex,
    playerAction,
    playerStates,
    playerInstances,
    gameEnvironment,
    evtCallback,
    coreCallback,
  } = data;
  const currentPlayerState = playerStates[playerIndex];

  if (DIRECTIONS.indexOf(playerAction) !== -1) {
    const newDirection = DIRECTIONS.indexOf(playerAction);
    const currentDirection = DIRECTIONS.indexOf(currentPlayerState.direction);

    // alert(newDirection, currentPlayerState.direction)

    let directionDifference = ((newDirection + 4) % 4) - ((currentDirection + 4) % 4);
    if (directionDifference === 3) directionDifference = -1;
    if (directionDifference === -3) directionDifference = 1;

    playerStates[playerIndex].direction = playerAction;
    playerStates[playerIndex].directionAngle =
      playerStates[playerIndex].directionAngle + directionDifference;
    return playerStates;
  }

  if (playerAction === "move") {
    switch (currentPlayerState.direction) {
      case DIRECTIONS[0]:
        currentPlayerState.position[0]--;
        break;
      case DIRECTIONS[1]:
        currentPlayerState.position[1]++;
        break;
      case DIRECTIONS[2]:
        currentPlayerState.position[0]++;
        break;
      case DIRECTIONS[3]:
        currentPlayerState.position[1]--;
        break;
      default:
        break;
    }

    // prevent the player to go over the world
    currentPlayerState.position[0] = safeMovement(
      currentPlayerState.position[0],
      gameEnvironment.gridSize
    );
    currentPlayerState.position[1] = safeMovement(
      currentPlayerState.position[1],
      gameEnvironment.gridSize
    );

    // check if the player collected ammo
    gameEnvironment.ammoPosition.forEach((el, index) => {
      if (el[0] === currentPlayerState.position[0] && el[1] === currentPlayerState.position[1]) {
        gameEnvironment.ammoPosition.splice(index, 1);
        currentPlayerState.ammo += 1;
      }
    });
  }

  if (playerAction === "shoot" && currentPlayerState.ammo > 0) {
    currentPlayerState.ammo -= 1;

    let kills = [];
    let survivors = [];

    evtCallback("SHOOT", {
      shooter: playerIndex,
      origin: currentPlayerState.position,
      direction: currentPlayerState.direction,
    });

    playerStates.forEach((enemyObject, enemyIndex) => {
      if (
        enemyObject.isAlive &&
        utils.isVisible(
          currentPlayerState.position,
          enemyObject.position,
          currentPlayerState.direction
        )
      ) {
        kills.push(enemyIndex);
        enemyObject.isAlive = false;
      }
    });

    if (kills.length) {
      survivors = _.filter(playerStates, (player) => player.isAlive);
      coreCallback("KILL", {
        killer: playerInstances[playerIndex],
        killed: _.map(kills, (index) => playerInstances[index]),
      });
      evtCallback("KILL", {
        killer: playerInstances[playerIndex],
        killed: _.map(kills, (index) => playerInstances[index]),
      });

      if (survivors.length === 1) {
        coreCallback("WIN", {
          winner: playerInstances[playerIndex],
        });
        evtCallback("WIN", {
          winner: playerInstances[playerIndex],
        });
      }
    }
  }

  return playerStates;
};

export default clashCoreUtils;
