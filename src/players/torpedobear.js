/**
 * Created by danieloram on 24/09/15.
 */
var utils = require('../lib/utils.js');


/*
var distanceFromAmmo = (currentPlayerState = {}, enemiesStates = []) => {

}
*/
/*
//move to closest corner
var moveToCorner = () => {

}
*/

//boilerplate code
var willKill = (currentPlayerState = {}, enemiesStates = []) => {
    return enemiesStates.some((enemyObject) => {
            return (enemyObject.isAlive && isVisible(currentPlayerState.position, enemyObject.position, currentPlayerState.direction));
});
};


var torpedobear = {
    info: {
        name: 'torpedobear',
        style: 7
    },
        ai: (playerState, enemiesStates, gameEnvironment) => {
        console.log(playerState, enemiesStates, gameEnvironment);
var directionToAmmo;

if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
    return 'shoot';
}
if (gameEnvironment.ammoPosition.length) {
    directionToAmmo = utils.fastGetDirection(playerState.position, gameEnvironment.ammoPosition[gameEnvironment.ammoPosition.length-1]);

    if (directionToAmmo !== playerState.direction) return directionToAmmo;
    return 'move';
}
return utils.safeRandomMove();
}
}

module.exports = torpedobear;