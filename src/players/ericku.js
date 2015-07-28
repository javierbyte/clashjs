var utils = require('../lib/utils.js');

var ericku = {
  info: {
    name: 'ericku',
    style: 1
  },
  ai: () => {
    return utils.randomMove();
  }
};

module.exports = ericku;
