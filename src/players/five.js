var utils = require('../lib/utils.js');

var five = {
  info: {
    name: 'five',
    style: 4
  },
  ai: () => {
    return utils.randomMove();
  }
};

module.exports = five;
