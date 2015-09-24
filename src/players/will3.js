var _ = require('lodash');
var utils = require('../lib/utils');

// module.exports = {
//   randomMove,
//   getDirection,
//   isVisible,
//   canKill,
//   safeRandomMove,
//   fastGetDirection,
//   turn,
//   getDistance
// };

module.exports = function() {
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

    var getNextPosition = function(playerState) {
        switch (playerState.direction) {
            case 'north':
                return [playerState[0], playerState[1] + 1];
            case 'west':
                return [playerState[0] - 1, playerState[1]];
            case 'south':
                return [playerState[0], playerState[1] - 1];
            case 'east':
                return [playerState[0] + 1, playerState[1]];
        }
    };

    var getWillBeKilled = function(playerState, enemiesStates) {
        var nextPosition = getNextPosition(playerState);

        return _.some(enemiesStates, function(enemyState) {
            return utils.canKill(enemyState, [{
                direction: playerState.direction,
                position: nextPosition
            }]);
        });
    };

    var getClosestCorner = function(playerState, gameEnvironment) {
        var gridSize = gameEnvironment.gridSize;

        var corners = [
            [0, 0],
            [0, gridSize - 1],
            [gridSize - 1, gridSize - 1],
            [gridSize - 1, 0]
        ];

        var minDis = null;
        var closestCorner = null;

        for (var i in corners) {
            var corner = corners[i];
            var distance = utils.getDistance(playerState.position, corner);
            if (distance < minDis || minDis == null) {
                minDis = distance;
                closestCorner = corner;
            }
        }

        return closestCorner;
    };

    return {
        info: {
            name: 'will3',
            style: 1 // one of the 6 styles (0 to 5)
        },
        ai: function(playerState, enemiesStates, gameEnvironment) {
            if (utils.canKill(playerState, enemiesStates)) {
                return 'shoot';
            }

            var canMove = !getWillBeKilled(playerState, enemiesStates);

            var move = utils.randomMove();
            if (playerState.ammo == 0 && gameEnvironment.ammoPosition.length > 0) {
                move = goToClosestAmmo(playerState, enemiesStates, gameEnvironment);
            }

            if (!canMove && move == 'move') {
                return utils.getDirection(playerState, [0, 0])
            }

            return move;
        }
    }
}();

// player state {
//     position: `[<number>, <number>]`,
//     direction: `<string>`, // One of 'north', 'east', 'south' or 'west'
//     ammo: `<number>`,
//     isAlive: `<bool>`
// }

// game gameEnvironment

// {
//     gridSize: [ < number > , < number > ],
//     ammoPosition: < array of[ < number > , < number > ] arrays >
// }

// Game State. {
//     playerStates: < array of `playerStates` > ,
//     gameEnvironment: < `gameEnvironment` >
// }