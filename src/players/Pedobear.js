var utils = require('../lib/utils.js');


var MUSOLINI = {
  info: {
    name: 'Pedobear',
    style: 8
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }

    // Check if enemies will shoot me if I move
    var minDistance = {d: 10000, direction: null};
    enemiesStates.forEach(enemy => {
      if (enemy.isAlive) {
        if (Math.abs(enemy.position[0] - playerState.position[0]) < minDistance.d) {
          minDistance.d = Math.abs(enemy.position[0] - playerState.position[0])
          minDistance.enemy = enemy
        }
        if (Math.abs(enemy.position[1] - playerState.position[1]) < minDistance.d) {
          minDistance.d = Math.abs(enemy.position[1] - playerState.position[1])
          minDistance.enemy = enemy
        }
      }
    })

    if (minDistance.enemy && minDistance.d < 2 && playerState.ammo) {
      return utils.fastGetDirection(playerState.position, minDistance.enemy.position)
    }


    if (gameEnvironment.ammoPosition.length) {
      var closestAmmo = gameEnvironment.ammoPosition.reduce((p, ammo) => {
        const d = utils.getDistance(playerState.position, ammo)
        if (d < p.distance) {
          p.ammo = ammo
          p.distance = d
          return p
        } else {
          return p
        }
      }, {distance: 10000, ammo: null})
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return utils.safeRandomMove();
  }
};

module.exports = MUSOLINI;
