var utils = require("../lib/utils.js");

var randombot = {
  info: {
    name: "random",
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    if (utils.isOnAsteroid(playerState.position, gameEnvironment.asteroids)) {
      console.log('&&& random avoided asteroid', gameEnvironment.asteroids, playerState)
      return 'move'
    }
    return utils.randomMove();
  },
};

module.exports = randombot;
