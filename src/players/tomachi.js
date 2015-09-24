var utils = require('../lib/utils.js');
var spin = 0;
var TOMACHI = {
  info: {
    name: 'Tomachi',
    style: 1
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) {
          return directionToAmmo;
        }
        return 'move';
    }
    return turnRight(playerState);
    //return utils.safeRandomMove(); 
  }
};

module.exports = TOMACHI;

function turnRight(currentPlayerState) {
  if (currentPlayerState.direction == "north") { return "east" }
  if (currentPlayerState.direction == "east") { return "south" }
  if (currentPlayerState.direction == "south") { return "west" }
  if (currentPlayerState.direction == "west") { return "north" }
}
