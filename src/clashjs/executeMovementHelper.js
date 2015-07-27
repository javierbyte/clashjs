var directions = ['north', 'east', 'south', 'west'];

var safeMovement = (value, size) => {
  if (value < 0) return 0;
  if (value > size - 1) return size - 1;
  return value;
};

var clashCoreUtils = (playerIndex, playerAction, playerStates, gameEnvironment) => {
  // console.warn('Saving actions:', playerIndex, playerAction);

  if (directions.indexOf(playerAction) !== -1) {
    playerStates[playerIndex].direction = directions.indexOf(playerAction);
    return playerStates;
  }

  if (playerAction === 'move') {
    switch (playerStates[playerIndex].direction) {
      case 0:
        playerStates[playerIndex].position[0]--;
        break;
      case 1:
        playerStates[playerIndex].position[1]++;
        break;
      case 2:
        playerStates[playerIndex].position[0]++;
        break;
      case 3:
        playerStates[playerIndex].position[1]--;
        break;
      default:
        break;
    }

    playerStates[playerIndex].position[0] = safeMovement(playerStates[playerIndex].position[0], gameEnvironment.gridSize);
    playerStates[playerIndex].position[1] = safeMovement(playerStates[playerIndex].position[1], gameEnvironment.gridSize);
  }

  return playerStates;
};

module.exports = clashCoreUtils;
