var utils = require('../lib/utils.js');

var MUSOLINI = {
  info: {
    name: 'Horror',
    style: 10
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    return utils.safeRandomMove();
  }
};

module.exports = MUSOLINI;
