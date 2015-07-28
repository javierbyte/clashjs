var utils = require('../lib/utils.js');

var manuelmhtr = {
  info: {
    name: 'manuelmhtr',
    style: 3
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    var directionToAmmo;

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.getDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return utils.randomMove();
  }
};

module.exports = manuelmhtr;
