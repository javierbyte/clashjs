var utils = require('../lib/utils.js');
var DIRECTIONS = ['north', 'east', 'south', 'west'];

var getShortestDirection = (start, endArray) => {
  var reducedArray = endArray.reduce((reduced, currentPosition) => {
    if (reduced[0] === -1 || utils.getDistance(start, currentPosition) < reduced[0]) {
      reduced[0] = utils.getDistance(start, currentPosition);
      reduced[1] = currentPosition;
    }

    return reduced;
  }, [-1, 0]);

  return utils.fastGetDirection(start, reducedArray[1]);
};

var turnToKill = (originalPosition, positionArray) => {
  return DIRECTIONS.reduce((result, currentDirection) => {
    if (result) return result;
    return positionArray.reduce((resultPositions, currentEnemyPosition) => {
      if (resultPositions) return resultPositions;
      return utils.isVisible(originalPosition, currentEnemyPosition, currentDirection) ? currentDirection : null;
    }, null);
  }, null);
};

var HITLER = {
  info: {
    name: 'Yuno',
    style: 6
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;
    var directionToPlayer;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) return 'shoot';

    if (playerState.ammo) {
      directionToPlayer = turnToKill(playerState.position, enemiesStates.map(el => el.position));
      if (directionToPlayer) {
        return directionToPlayer;
      }

      directionToPlayer = getShortestDirection(playerState.position, enemiesStates.map(el => el.position));
      if (directionToPlayer !== playerState.direction) return directionToPlayer;
      return 'move';
    }

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = getShortestDirection(playerState.position, gameEnvironment.ammoPosition);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return utils.safeRandomMove();
  }
};

module.exports = HITLER;
