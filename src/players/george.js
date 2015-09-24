var utils = require('../lib/utils.js');

function attackEnemy(playerState, enemiesStates){
	if(!playerState.ammo)
		return null;

	var myPosition = playerState.position;
	var first = 0;
	for(var i=0;i<enemiesStates.length;i++){
		if(!enemiesStates[i].alive)
			continue;
		first = i;
		if(enemiesStates[i].ammo){
			var directionToEnemy = utils.getDirection(
				playerState.position,
				enemiesStates[i].position
			);
//			console.log(directionToEnemy);
			return directionToEnemy;
		}
	}
	return utils.getDirection(myPosition, enemiesStates[first].position);
}

var george = {
	info: {
		name: 'george',
		style: 1
	},
	ai: (playerState, enemiesStates, gameEnvironment) => {
		var directionToAmmo;
		var myPosition = playerState.position;

		if (utils.canKill(playerState, enemiesStates) && playerState.ammo) {
			return 'shoot';
		}

		var direction = attackEnemy(playerState, enemiesStates);
		if(direction)
			return direction;

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
