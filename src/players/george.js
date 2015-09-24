var utils = require('../lib/utils.js');

function attackEnemy(playerState, enemiesStates){
	if(!playerState.ammo)
		return null;

	var myPosition = playerState.position;
	for(var i=0;i<enemiesStates.length;i++){
		if(enemiesStates[i].ammo){
			var directionToEnemy = utils.getDirection(
				playerState.position,
				enemiesStates[i].position
			);
//			console.log(directionToEnemy);
			return directionToEnemy;
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

		var direction = attackEnemy(playerState, enemiesStates);
		if(direction)
			return direction;

		if(playerState.ammo>=2)
			return utils.getDistance(myPosition, enemiesStates[0].position);

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
