var utils = require('../lib/utils.js');
var _ = require('lodash');

var goToClosestAmmo = function(playerState, enemiesStates, gameEnvironment) {
    var closestAmmo = _.sortBy(gameEnvironment.ammoPosition, function(ammoPosition) {
        return utils.getDistance(playerState.position, ammoPosition);
    })[0];

    var direction = utils.getDirection(playerState.position, closestAmmo);
    if (playerState.direction != direction) {
        return direction;
    }

    return 'move';
};

var livingEnemyPlayerPositions = function(enemiesStates) {
    var positions = _.map(enemiesStates, function(state){
        return state.position;
    });
    return positions;
}

var directionsToPositions = function(currentPosition, positions) {
    var directions = _.map(positions, function(pos) {
        return utils.fastGetDirection(currentPosition, pos);
    });
    return directions;
}

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
      return goToClosestAmmo(playerState, enemiesStates, gameEnvironment);
    }

    // if have ammo, go camp somewhere
    //return utils.safeRandomMove();
    var allDirections = directionsToPositions(playerState.position,
        livingEnemyPlayerPositions(enemiesStates));
    console.log('enemy directions' + allDirections);

    var myArray = ['north', 'south', 'east', 'west'];
    return allDirections[Math.floor(Math.random() * allDirections.length)];
    //return utils.safeRandomMove();
  }
}

module.exports = thor
