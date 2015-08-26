var utils = require('../lib/utils.js');
var ORIENTATION = {north: 'vertical', east: 'horizontal', south: 'vertical', west: 'horizontal'};

var manuelmhtr = {
  info: {
    name: 'Manuelmhtr',
    style: 3
  },
  ai: function(playerState, enemiesStates, gameEnvironment) {
    var response;
    var enemies = [];
    var params = {
      vulnerabilityLevel: null,
      canKill: null,
      nearestAmmo: null,
      nearestEnemy: null,
      canMove: null
    };

    // Parse enemies
    enemiesStates.forEach(function(enemy) {
      if (enemy.isAlive === true) {
        enemy.nearestAmmoDistance = calculateDistanceToNearestAmmo(enemy.position);
        enemies.push(enemy);
      }
    });

    // Process parameters
    params.vulnerabilityLevel = calculateVulnerabilityLevel(playerState.position);
    params.canKill = playerState.ammo > 0 && utils.canKill(playerState, enemiesStates);
    params.nearestAmmo = getNearestAmmo(playerState.position);
    params.nearestEnemy = getNearestEnemy(playerState.position);
    params.canMove = canMove(playerState.position, playerState.direction);

    function calculateVulnerabilityLevel(targetPosition) {
      var vulnerabilityLevel = 0.0;
      enemies.forEach(function(enemy) {
        if (utils.isVisible(enemy.position, targetPosition, enemy.direction) && enemy.ammo > 0) {
          vulnerabilityLevel = Math.max(vulnerabilityLevel, 1.0);
        } else if (isAligned(enemy.position, targetPosition) && (enemy.ammo > 0 || enemy.nearestAmmoDistance === 1)) {
          vulnerabilityLevel = Math.max(vulnerabilityLevel, 0.5);
        }
      });

      if (vulnerabilityLevel === 0.0) {
        // Check if other enemies are near
        var northEast = [targetPosition[0] + 1, targetPosition[1] + 1];
        var southWest = [targetPosition[0] - 1, targetPosition[1] - 1];
        enemies.forEach(function(enemy) {
          if (enemy.ammo > 0) {
            if (isAligned(enemy.position, northEast) || isAligned(enemy.position, southWest)) {
              vulnerabilityLevel = Math.max(vulnerabilityLevel, 0.25);
            }
          }
        });
      }

      return vulnerabilityLevel;
    }

    function isAligned(originalPosition, finalPosition) {
      var aligned = false;
      aligned = aligned || originalPosition[1] === finalPosition[1] && originalPosition[0] > finalPosition[0];
      aligned = aligned || originalPosition[0] === finalPosition[0] && originalPosition[1] < finalPosition[1];
      aligned = aligned || originalPosition[1] === finalPosition[1] && originalPosition[0] < finalPosition[0];
      aligned = aligned || originalPosition[0] === finalPosition[0] && originalPosition[1] > finalPosition[1];
      return aligned;
    }

    function getNearestAmmo(position) {
      var nearestAmmo = null;
      var nearestDistance = null;
      gameEnvironment.ammoPosition.forEach(function(ammo) {
        var distance = utils.getDistance(position, ammo);
        if (nearestDistance === null || distance < nearestDistance) {
          nearestDistance = distance;
          nearestAmmo = {
            position: ammo,
            distance: nearestDistance
          };
        }
      });
      return nearestAmmo;
    }

    function calculateDistanceToNearestAmmo(position) {
      var nearestDistance = null;
      gameEnvironment.ammoPosition.forEach(function(ammo) {
        var distance = utils.getDistance(position, ammo);
        if (nearestDistance === null || distance < nearestDistance) {
          nearestDistance = distance;
        }
      });
      return nearestDistance;
    }

    function getNearestEnemy(position) {
      var nearestEnemy = null;
      var nearestDistance = null;
      enemies.forEach(function(enemy) {
        var distance = calculateEnemyDistance(position, enemy);

        if (nearestDistance === null || distance < nearestDistance) {
          nearestDistance = distance;
          nearestEnemy = {
            instance: enemy,
            distance: nearestDistance
          };
        }
      });
      return nearestEnemy;
    }

    function calculateEnemyDistance(position, enemy) {
      var diffVertical = Math.abs(position[0] - enemy.position[0]);
      var diffHorizontal = Math.abs(position[1] - enemy.position[1]);
      return Math.min(diffHorizontal, diffVertical);
    }

    function defend() {
      if (params.vulnerabilityLevel === 1.0) {
        var canRun = params.canMove;
        var attacker;

        // Find attacker
        enemies.forEach(function(enemy) {
          if (enemy.ammo > 0 && utils.isVisible(enemy.position, playerState.position, enemy.direction)) {
            attacker = enemy;
          }
        });

        // Check if can run
        if (attacker && ORIENTATION[attacker.direction] === ORIENTATION[playerState.direction]) {
          canRun = false;
        }

        if (canRun) {
          return 'move';
        } else if (attacker && playerState.ammo > 0) {
          // Counterattack
          return huntEnemy(attacker);
        } else {
          return getSafestDirection();
        }
      } else {
        return getSafestDirection();
      }
    }

    function getSafestDirection() {
      var safestDirection = playerState.direction;
      var lowestVulnerability = params.vulnerabilityLevel;
      var maxDistanceLeft = 0;

      var options = [{
          direction: 'north',
          position: [playerState.position[0] - 1, playerState.position[1]]
        }, {
          direction: 'east',
          position: [playerState.position[0], playerState.position[1] + 1]
        }, {
          direction: 'south',
          position: [playerState.position[0] + 1, playerState.position[1]]
        }, {
          direction: 'west',
          position: [playerState.position[0], playerState.position[1] - 1]
        }
      ];

      // Process options
      options.forEach(function(option) {
        option.vulnerability = calculateVulnerabilityLevel(option.position);
        option.distanceLeft = calculateDistanceLeft(option.direction);
        option.canMove = canMove(playerState.position, option.direction);
        var isBetterOption = option.vulnerability < lowestVulnerability || (option.vulnerability === lowestVulnerability && option.distanceLeft > maxDistanceLeft);
        if (option.canMove && isBetterOption) {
          safestDirection = option.direction;
          lowestVulnerability = option.vulnerability;
          maxDistanceLeft = option.distanceLeft;
        }
      });

      if (safestDirection === playerState.direction) {
        return moveSafely();
      } else {
        return safestDirection;
      }

      function calculateDistanceLeft(direction) {
        if (direction === 'north') {
          return playerState.position[0];
        } else if (direction === 'east') {
          return gameEnvironment.gridSize - playerState.position[1];
        } else if (direction === 'south') {
          return gameEnvironment.gridSize - playerState.position[0];
        } else if (direction === 'west') {
          return playerState.position[1];
        }
      }
    }

    function canMove(position, direction) {
      if (direction === 'north') {
        return position[0] > 0;
      } else if (direction === 'east') {
        return position[1] < gameEnvironment.gridSize;
      } else if (direction === 'south') {
        return position[0] < gameEnvironment.gridSize;
      } else if (direction === 'west') {
        return position[1] > 0;
      }
    }

    function attack() {
      return 'shoot';
    }

    function moveWisely() {
      if (playerState.ammo === 0 && params.nearestAmmo) {
        return getAmmo(params.nearestAmmo.position);
      } else if (playerState.ammo > 0 && params.nearestEnemy) {
        if (params.nearestAmmo && params.nearestAmmo.distance < params.nearestEnemy.distance) {
          return getAmmo(params.nearestAmmo.position);
        } else {
          return huntEnemy(params.nearestEnemy.instance);
        }
      } else {
        return getSafestDirection();
      }
    }

    function huntEnemy(enemy) {
      if (utils.isVisible(playerState.position, enemy.position, playerState.direction)) {
        return attack();
      } else {
        var attackDirection = getAttackDirection();
        var enemyDistance = calculateEnemyDistance(playerState.position, enemy);

        if (attackDirection === playerState.direction && (enemyDistance > 1 || enemy.ammo === 0)) {
          return 'move';
        } else {
          return attackDirection;
        }
      }

      function getAttackDirection() {
        var isEnemyAligned = isAligned(playerState.position, enemy.position);
        var enemyOrientation = ORIENTATION[enemy.direction];

        if (isEnemyAligned) {
          return utils.fastGetDirection(playerState.position, enemy.position);
        } else {
          if (enemyOrientation === 'vertical') {
            return enemy.position[1] > playerState.position[1] ? 'east' : 'west';
          } else {
            return enemy.position[0] > playerState.position[0] ? 'south' : 'north';
          }
        }
      }
    }

    function moveSafely() {
      var destination;
      var vulnerabilityOnMove;

      if (playerState.direction === 'north') {
        destination = [playerState.position[0] - 1, playerState.position[1]];
      } else if (playerState.direction === 'east') {
        destination = [playerState.position[0], playerState.position[1] + 1];
      } else if (playerState.direction === 'south') {
        destination = [playerState.position[0] + 1, playerState.position[1]];
      } else if (playerState.direction === 'west') {
        destination = [playerState.position[0], playerState.position[1] - 1];
      }

      vulnerabilityOnMove = calculateVulnerabilityLevel(destination);

      if (vulnerabilityOnMove === 1.0) {
        return null;
      } else {
        return 'move';
      }
    }

    function getAmmo(ammoPosition) {
      // Get direction to turn
      var goToDirection = utils.fastGetDirection(playerState.position, ammoPosition);

      // If same direction, move
      if (goToDirection === playerState.direction) {
        return moveSafely();
      } else {
        return goToDirection;
      }
    }

    // Decide movement
    if (params.vulnerabilityLevel === 1.0 || params.vulnerabilityLevel >= 0.5 && params.canKill !== true) {
      response = defend();
    } else if (params.canKill === true) {
      response = attack();
    } else {
      response = moveWisely();
    }
    return response;

  }
};

module.exports = manuelmhtr;
