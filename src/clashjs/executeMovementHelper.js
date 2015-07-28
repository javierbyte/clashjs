var DIRECTIONS = ['north', 'east', 'south', 'west'];

var safeMovement = (value, size) => {
  if (value < 0) return 0;
  if (value > size - 1) return size - 1;
  return value;
};

var clashCoreUtils = (playerIndex, playerAction, playerStates, gameEnvironment) => {
  if (DIRECTIONS.indexOf(playerAction) !== -1) {
    playerStates[playerIndex].direction = playerAction;
    return playerStates;
  }

  if (playerAction === 'move') {
    switch (playerStates[playerIndex].direction) {
      case DIRECTIONS[0]:
        playerStates[playerIndex].position[0]--;
        break;
      case DIRECTIONS[1]:
        playerStates[playerIndex].position[1]++;
        break;
      case DIRECTIONS[2]:
        playerStates[playerIndex].position[0]++;
        break;
      case DIRECTIONS[3]:
        playerStates[playerIndex].position[1]--;
        break;
      default:
        break;
    }

    // prevent the player to go over the world
    playerStates[playerIndex].position[0] = safeMovement(playerStates[playerIndex].position[0], gameEnvironment.gridSize);
    playerStates[playerIndex].position[1] = safeMovement(playerStates[playerIndex].position[1], gameEnvironment.gridSize);

    // check if the player collected ammo
    gameEnvironment.ammoPosition.forEach((el, index) => {
      if (el[0] === playerStates[playerIndex].position[0] && el[1] === playerStates[playerIndex].position[1]) {
        gameEnvironment.ammoPosition.splice(index, 1);
        playerStates[playerIndex].ammo += 1;
      }
    });
  }

  return playerStates;
};

module.exports = clashCoreUtils;
