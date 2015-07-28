var utils = require('../lib/utils.js');

var six = {
  info: {
    name: 'six',
    style: 5
  },
  ai: () => {
    return utils.randomMove();
  }
};

module.exports = six;
