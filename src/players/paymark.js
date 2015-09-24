///
// TEAM PAYMARK
///


var utils = require('../lib/utils.js');

var gameRunner = {
  info: {
    name: 'Paymark',
    style: 1,
    state: {
        test: "hello"
    }
},
ai: (playerState, enemiesState, gameEnvironment) => {

    var hasAmmo = playerState.ammo > 0;
    var i;
    var directionToAmmo;


    //kill if possible
    if (utils.canKill(playerState, enemiesState) && playerState.ammo) {
        return 'shoot';
    }

    //otherwise go for ammo if we don't have any
    if (gameEnvironment.ammoPosition.length && !hasAmmo) {

        var minDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[0]));
        directionToAmmo = utils.getDirection(
            playerState.position,
            gameEnvironment.ammoPosition[0]
        );


        for(i=1; i>gameEnvironment.ammoPosition; i++) {
            var testDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]));
            if(testDist < minDist) {
                minDist = testDist;
                directionToAmmo = utils.getDirection(
                    playerState.position,
                    gameEnvironment.ammoPosition[i]
                );
            }
        }
        if (directionToAmmo !== playerState.direction) {
            console.log("turning to ammo");
            return directionToAmmo;
        }
        console.log("moving to ammo");
        return 'move';
    }

    //otherwise hunt 
    if (gameEnvironment.ammoPosition.length) {
        console.log("hunting");
    }





    //return utils.randomMove();
}
};

module.exports = gameRunner;
