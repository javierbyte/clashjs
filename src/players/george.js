var utils = require('../lib/utils.js');

function avoidEnemy(playerState, enemiesStates){
	if(playerState.ammo)
		return null;

	var myPosition = playerState.position;
	for(var i=0;i<enemiesStates.length;i++){
		if(enemiesStates[i].ammo){
			var directionToEnemy = utils.getDirection(
				gameEnvironment.ammoPosition[index],
				playerState.position
			);
			if(directionToEnemy==enemiesStates[i].direction)
				return null;
		}
	}
}

var george = {
	info: {
		name: 'george',
		style: 1
	},
	ai: (playerState, enemiesStates, gameEnvironment) => {
		var directionToAmmo;

		if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
			return 'shoot';
		}

		var myPosition = playerState.position;

		if (gameEnvironment.ammoPosition.length) {
			var distance = 10000;
			var index = -1;
			for(var i=0;i<gameEnvironment.ammoPosition.length;i++){
				var d = utils.getDistance(myPosition, gameEnvironment.ammoPosition[i]);
				if(d<distance){
					index =i;
					distance = d;
				}
			}

			directionToAmmo = utils.getDirection(
				playerState.position,
				gameEnvironment.ammoPosition[index]
			);

			if (directionToAmmo !== playerState.direction) {
				return directionToAmmo;
			}
			return 'move';
		}

		return utils.randomMove();
		}
};

module.exports = george;
