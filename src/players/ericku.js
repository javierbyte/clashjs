var utils = require('../lib/utils.js');

var ericku = {
  info: {
    name: 'ericku',
    style: 1
  },
  ai: (playerState, enemiesStates) => {
    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    return utils.safeRandomMove();
  }
};

module.exports = ericku;
