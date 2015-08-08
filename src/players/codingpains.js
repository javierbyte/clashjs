var utils = require('../lib/utils.js');

var codingpains = {
  info: {
    name: 'Codingpains',
    style: 0
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    return utils.randomMove();
  }
};

module.exports = codingpains;
