var utils = require('../lib/utils.js');

var merica = {
  info: {
    name: 'merica',
    style: 2
  },
  ai: function(playerState, enemiesStates, gameEnvironment) {
    var directionToAmmo;

    // if camping, and enemy in line of fire, fire.
    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    // if no ammo, find ammo
    if (!playerState.ammo && gameEnvironment.ammoPosition.length) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    // if have ammo, go camp somewhere
    //return utils.safeRandomMove();
    var myArray = ['north', 'south', 'east', 'west'];
    return myArray[Math.floor(Math.random() * myArray.length)];
    //return utils.safeRandomMove();
  }
}
var getNextPosition = function(playerState) {
    switch (playerState.direction) {
        case 'north':
            return [playerState[0], playerState[1] + 1];
        case 'west':
            return [playerState[0] - 1, playerState[1]];
        case 'south':
            return [playerState[0], playerState[1] - 1];
        case 'east':
            return [playerState[0] + 1, playerState[1]];
    }

module.exports = merica
