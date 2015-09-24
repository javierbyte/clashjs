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
    var closestAmmoPos;

    console.log(playerState.custom);

    if(!playerState.custom) {
        playerState.custom = {};
    }


    //kill if possible
    if (utils.canKill(playerState, enemiesState) && playerState.ammo) {
        return 'shoot';
    }

    //find closest ammo direction
    if (gameEnvironment.ammoPosition.length > 0) {

        var minDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[0]));
        closestAmmoPos = gameEnvironment.ammoPosition[0];
        directionToAmmo = utils.getDirection(
            playerState.position,
            gameEnvironment.ammoPosition[0]
        );


        for(i=1; i<gameEnvironment.ammoPosition.length; i++) {
            console.log(gameEnvironment.ammoPosition[i]);

            var testDist = Math.abs(utils.getDistance(playerState.position, gameEnvironment.ammoPosition[i]));
            console.log("comparing " + testDist + " < " + minDist);
            if(testDist < minDist) {
                console.log("testDist smaller");
                minDist = testDist;
                directionToAmmo = utils.getDirection(
                    playerState.position,
                    gameEnvironment.ammoPosition[i]
                );
                closestAmmoPos = gameEnvironment.ammoPosition[i];
            }
        }
        
    }

    //move to ammo
    if(!hasAmmo) {
        if (directionToAmmo !== playerState.direction) {
            console.log("turning to ammo");
            return directionToAmmo;
        }
        console.log("moving to ammo");
        return 'move';
    }

    //otherwise hunt 
    if (gameEnvironment.ammoPosition.length > 0) {
        console.log("hunting");

        if(!utils.isVisible(playerState.position, closestAmmoPos, playerState.direction)) {
            if (directionToAmmo !== playerState.direction) {
                console.log("turning to ammo");
                return directionToAmmo;
            }
            console.log("moving to ammo");
            return 'move';
        }

    }





    //return utils.randomMove();
}
};

module.exports = gameRunner;
