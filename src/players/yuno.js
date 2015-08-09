var utils = require('../lib/utils.js');

var HITLER = {
  info: {
    name: 'Yuno',
    style: 6
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;
    var directionToPlayer;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    if (playerState.ammo) {
      directionToPlayer = utils.fastGetDirection(playerState.position, enemiesStates[0].position);
      if (directionToPlayer !== playerState.direction) return directionToPlayer;
      return 'move';
    }

    if (playerState.ammo < enemiesStates.length && gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return utils.safeRandomMove();
  }
};

module.exports = HITLER;
