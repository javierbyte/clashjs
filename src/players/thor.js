var utils = require('../lib/utils.js');

var thor = {
  info: {
    name: 'thor',
    style: 2 // one of the 6 styles (0 to 5)
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

module.exports = thor
