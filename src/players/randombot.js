var utils = require('../lib/utils.js');

var randombot = {
  info: {
    name: 'random',
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    return utils.randomMove()
  }
};

module.exports = randombot;
