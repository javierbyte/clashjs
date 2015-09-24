var utils = require('../lib/utils.js');

var state = {
  lastAmmo:0
};

var MUSOLINI = {
  info: {
    name: 'Psi',
    style: 5
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    console.log(playerState, enemiesStates, gameEnvironment);
    // console.log()
    // console.log()
    var directionToAmmo;

    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    if (gameEnvironment.ammoPosition.length) {

      var closestAmmoId = getClosestAmmoId(playerState.position, gameEnvironment.ammoPosition);

      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[closestAmmoId]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    return utils.safeRandomMove();
  }
};


function getClosestAmmoId(myPos, ammoPosList) {
  var minDist = 9999;
  var closestAmmoId = 0;

  ammoPosList.forEach(function (ammo, i) {
    var dist = distance(myPos, ammo);
console.log(i, dist);
    if (dist < minDist) {
      minDist = dist;
      closestAmmoId = i;
    }
  });
  console.log('closest:', closestAmmoId, minDist);
  return closestAmmoId;
}

function distance(p1, p2) {
  return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]));
}

module.exports = MUSOLINI;
