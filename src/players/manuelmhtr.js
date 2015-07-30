var utils = require('../lib/utils.js');

var manuelmhtr = {
  info: {
    name: 'manuelmhtr',
    style: 3
  },
  ai: (playerState) => {
    if (playerState.ammo) {
      return 'shoot';
    }

    return utils.randomMove();
  }
};

module.exports = manuelmhtr;
