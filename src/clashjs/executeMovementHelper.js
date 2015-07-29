var utils = require('../lib/utils.js');
var DIRECTIONS = ['north', 'east', 'south', 'west'];

var safeMovement = (value, size) => {
  if (value < 0) return 0;
  if (value > size - 1) return size - 1;
  return value;
};

var clashCoreUtils = (playerIndex, playerAction, playerStates, gameEnvironment, evtCallback) => {
  var currentPlayerState = playerStates[playerIndex];

  if (DIRECTIONS.indexOf(playerAction) !== -1) {
    currentPlayerState.direction = playerAction;
    return playerStates;
  }

  if (playerAction === 'move') {
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
    currentPlayerState.position[0] = safeMovement(currentPlayerState.position[0], gameEnvironment.gridSize);
    currentPlayerState.position[1] = safeMovement(currentPlayerState.position[1], gameEnvironment.gridSize);

    // check if the player collected ammo
    gameEnvironment.ammoPosition.forEach((el, index) => {
      if (el[0] === currentPlayerState.position[0] && el[1] === currentPlayerState.position[1]) {
        gameEnvironment.ammoPosition.splice(index, 1);
        currentPlayerState.ammo += 1;
      }
    });
  }

  if (playerAction === 'shoot' && currentPlayerState.ammo > 0) {
    currentPlayerState.ammo -= 1;

    let kills = [];
    evtCallback('SHOOT', {
      shooter: playerIndex,
      origin: currentPlayerState.position,
      direction: currentPlayerState.direction
    });

    playerStates.forEach((enemyObject, enemyIndex) => {
      if (enemyObject.isAlive && utils.isVisible(currentPlayerState.position, enemyObject.position, currentPlayerState.direction)) {
        kills.push(enemyIndex);
        enemyObject.isAlive = false;
      }
    });

    if (kills.length) {
      evtCallback('KILL', {
        killer: playerIndex,
        killed: kills
      });
    }

  }

  return playerStates;
};

module.exports = clashCoreUtils;

