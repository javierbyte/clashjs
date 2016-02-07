var utils = require('../lib/utils.js');
var noAmmo = true;
var margeux = {
  info: {
    name: 'margeux',
    style: 5
  },
  ai: (playerState, enemiesStates, gameEnvironment) => {
    var directionToAmmo;
    var directionToEnemy;
    if (playerState.ammo >0){
      noAmmo = false;
    }
    if (playerState.ammo == 0){
      noAmmo= true;
    }

    if (gameEnvironment.ammoPosition.length && noAmmo) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    //LOOK for an enemy
    if(!noAmmo){
      directionToEnemy = utils.fastGetDirection(playerState.position, enemiesStates[0].position);
      if (directionToEnemy !== playerState.direction){
        var directionToMargeus = utils.fastGetDirection(enemiesStates[0].position, playerState.position);
        if (directionToMargeus !== enemiesStates[0].position){
                  return directionToEnemy;
        }else{
                  return utils.safeRandomMove();
        }
      }
      if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
      }else{
        return utils.safeRandomMove();
      }
    }


    if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
      return 'shoot';
    }
    if (gameEnvironment.ammoPosition.length ) {
      directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }
    return utils.safeRandomMove();
  }
};

module.exports = margeux;
