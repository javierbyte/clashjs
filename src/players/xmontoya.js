var utils = require('../lib/utils.js');

var xmontoya = {
  info: {
    name: 'Xmontoya89',
    style: 1
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return utils.safeRandomMove();
    }

    return 'move';
  }
};

module.exports = xmontoya;
