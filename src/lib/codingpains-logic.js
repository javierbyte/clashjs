var utils = require('./utils.js');
var DIRECTIONS = ['north', 'east', 'south', 'west'];

var inDanger = function(player, enemies) {
  if (!enemies.length) return false;
  var pos = player.position;
  return _.some(enemies, e => sameY(pos, e.position) || sameX(pos, e.position));
};

var sameY = function(start, end) {
  return start[0] === end[0];
};

var sameX = function(start, end) {
  return start[1] === end[1];
};

var canMoveTowards = function(direction, player, map) {
  var canDo = false;
  switch (direction) {
    case 'north':
      canDo = player.position[0] > 0;
      break;
    case 'east':
      canDo = player.position[1] < map.gridSize;
      break;
    case 'south':
      canDo = player.position[0] < map.gridSize - 1;
      break;
    case 'west':
      canDo = player.position[1] > 0;
      break;
  }
  return canDo;
};

var canDie = function(player, enemies) {
  return enemies
    .map(function(enemy) {
      return enemy.ammo > 0 && utils.isVisible(enemy.position, player.position, enemy.direction);
    })
    .filter(function(result) {
      return result === true;
    }).length > 0;
};

var getClosestAmmo = function(player, ammoPosition) {
  var closest;

  if (!ammoPosition.length) return;

  closest = ammoPosition[0];

  ammoPosition.forEach(function(ammo) {
    var isCloser = utils.getDistance(player.position, ammo) < utils.getDistance(player.position, closest);
    if (isCloser) {
      closest = ammo;
    }
  });

  return closest;
};

var getReachableAmmo = function(player, enemies, map) {
  var reachable = map.ammoPosition.filter(function(ammo) {
    var distance = utils.getDistance(player.position, ammo);

    return !enemies.some(function(enemy) {
      return utils.getDistance(enemy.position, ammo) < distance;
    });
  });

  return reachable;
};

var shouldMoveForAmmo = function(player, enemies, map) {
  var ammo = getReachableAmmo(player, enemies, map);
  var closest;
  var direction;

  if (!ammo.length) return false;

  closest = getClosestAmmo(player, ammo);
  direction = utils.fastGetDirection(player.position, closest);

  if (direction !== player.direction) {
    return direction;
  }

  return 'move';
};

var isMovementSafe = function(action, player, enemies, map) {
  var futureState = JSON.parse(JSON.stringify(player));

  if (action === 'move') {
    switch (player.direction) {
      case DIRECTIONS[0]:
        if (futureState.position[0] > 0) {
          futureState.position[0]--;
        }
        break;
      case DIRECTIONS[1]:
        if (futureState.position[1] < map.gridSize) {
          futureState.position[1]++;
        }
        break;
      case DIRECTIONS[2]:
        if (futureState.position[0] < map.gridSize) {
          futureState.position[0]++;
        }
        break;
      case DIRECTIONS[3]:
        if (futureState.position[1] > 0) {
          futureState.position[1]--;
        }
        break;
      default:
        break;
    }
  }

  if (canDie(futureState, enemies)) {
    return false;
  } else {
    return true;
  }
};

var getSafestMove = function(player, enemies, map) {
  var safest;
  var isSafeHere = isMovementSafe('north', player, enemies, map);
  var isSafeToMove = isMovementSafe('move', player, enemies, map);

  if (isSafeHere) {
    if (player.ammo) {
      return turnToKill(player, enemies) || chaseEnemy(player, enemies, map);
    }
  }
  if (isSafeToMove) {
    return 'move';
  }

  return;
};

var goToCenter = function(player, map) {
  var center = [map.gridSize, map.gridSize].map(coord => Math.floor(coord / 2));
  var movement = utils.fastGetDirection(player.position, center);

  if (movement === player.direction) {
    movement = 'move';
  }

  return movement;
};

var getClosestEnemy = function(player, enemies) {
  var clonedStates = enemies.slice(0, enemies.length);
  var closest;

  clonedStates = clonedStates.filter(function(enemy) {
    return enemy.isAlive;
  });

  closest = clonedStates[0];

  clonedStates.forEach(function(enemy) {
    if (utils.getDistance(player, enemy) < utils.getDistance(player, closest)) {
      closest = enemy;
    }
  });

  return closest;
};

var getBackPosition = function(enemy) {
  var back = enemy.position.slice(0, 2);
  switch (enemy.direction) {
    case 'north':
      back[0]++;
      break;
    case 'south':
      back[0]--;
      break;
    case 'west':
      back[1]++;
      break;
    case 'east':
      back[1]--;
      break;
  }

  return back;
};

var sneakyGetDirection = function(player, enemy) {
  var diffVertical = Math.abs(player.position[0] - player.position[0]);

  if (diffVertical && enemy.position !== 'north' && enemy.position !== 'south') {
    return player.position[0] - enemy.position[0] > 0 ? 'north' : 'south';
  }
  return player.position[1] - enemy.position[1] > 0 ? 'west' : 'east';
};

var verticalDelta = function(start, end) {
  return start[0] - end[0];
};

var absVerticalDelta = function(start, end) {
  return Math.abs(verticalDelta(start, end));
};

var horizontalDelta = function(start, end) {
  return start[1] - end[1];
};

var absHorizontalDelta = function(start, end) {
  return Math.abs(horizontalDelta(start, end));
};

var isVertical = function(direction) {
  return ['north', 'south'].indexOf(direction) > -1;
};

var isHorizontal = function(direction) {
  return ['west', 'east'].indexOf(direction) > -1;
};

var opositeDirection = function(direction) {
  var ret;
  switch (direction) {
    case 'north':
      ret = 'south';
      break;
    case 'south':
      ret = 'north';
      break;
    case 'west':
      ret = 'east';
      break;
    case 'east':
      ret = 'west';
      break;
  }
  return ret;
};

var chaseEnemy = function(player, enemies, map) {
  var closest = getClosestEnemy(player, enemies);
  var back = getBackPosition(closest);
  var direction = sneakyGetDirection(player, closest);

  if (direction !== player.direction) {
    return direction;
  }

  if (!isMovementSafe('move', player, [closest], map)) {
    if (isVertical(player.direction) && absHorizontalDelta(player.position, closest.position) === 1) return 'hold';
    if (isHorizontal(player.direction) && absVerticalDelta(player.position, closest.position) === 1) return 'hold';
    return opositeDirection(closest.direction);
  }

  return 'move';
};

var turnToKill = function(player, enemies) {
  var turn = false;
  var mockState = JSON.parse(JSON.stringify(player));

  DIRECTIONS.forEach(function(direction) {
    mockState.direction = direction;

    if (utils.canKill(mockState, enemies)) {
      turn = direction;
    }
  });

  return turn;
};

var turnToAmbush = function(player, enemies) {
  var killables = enemies.filter(function(enemy) {
    switch (enemy.direction) {
      case 'north':
        return verticalDelta(player.position, enemy.position) === -1;
        break;
      case 'east':
        return verticalDelta(player.position, enemy.position) === 1;
        break;
      case 'south':
        return verticalDelta(player.position, enemy.position) === 1;
        break;
      case 'west':
        return verticalDelta(player.position, enemy.position) === -1;
        break;
      default:
        return false;
    }
  });
  var enemy;

  if (!killables.length) return;
  enemy = killables[0];
  if (isVertical(enemy.direction)) {
    if (horizontalDelta(player.position, enemy.position) < 0) return 'east';
    return 'west';
  }

  if (verticalDelta(player.position, enemy.position) < 0) return 'south';
  return 'north';
};

var canKillMany = function(player, enemies) {
  let { position, direction } = player;
  var targets = _.filter(enemies, enemy => utils.isVisible(position, enemy.position, direction));
  return targets.length > 2;
};

var canKillAll = function(player, enemies) {
  if (!player.ammo) return false;
  var killable = enemies.filter(enemy => utils.canKill(player, [enemy]));

  return enemies.length === killable.length;
};

var getImmediateThreats = function(player, enemies) {
  return enemies.filter(enemy => enemy.ammo > 0 && utils.isVisible(enemy.position, player.position, enemy.direction));
};

var getDangerousEnemies = function(enemies) {
  var dangerous = enemies.filter(enemy => enemy.ammo);
  if (dangerous.length) return dangerous;
  return enemies;
};

module.exports = {
  inDanger,
  sameY,
  sameX,
  canDie,
  canMoveTowards,
  canKillMany,
  getClosestAmmo,
  getReachableAmmo,
  shouldMoveForAmmo,
  isMovementSafe,
  getSafestMove,
  goToCenter,
  getClosestEnemy,
  getBackPosition,
  sneakyGetDirection,
  isHorizontal,
  isVertical,
  absVerticalDelta,
  absHorizontalDelta,
  opositeDirection,
  chaseEnemy,
  turnToKill,
  turnToAmbush,
  canKillAll,
  getImmediateThreats,
  getDangerousEnemies
};
