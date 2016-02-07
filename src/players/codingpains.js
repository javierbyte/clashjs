var utils = require('./../lib/utils');
var logic = require('./../lib/codingpains-logic');

var codingpains = {
  info: {
    name: 'HGE-7',
    style: 8
  },

  ai: function(player, enemies, map) {
    var armedEnemies = _.filter(enemies, (enemy) => enemy.ammo > 0);
    if (logic.inDanger(player, armedEnemies)) return codingpains._eluder(player, armedEnemies, map);
    if (player.ammo) return codingpains._hunter(player, enemies, map);
    return codingpains._gatherer(player, enemies, map);
  },

  _gatherer: function(player, enemies, map) {
    var ammoMove;
    var safestMove;
    var centerMove;
    codingpains.info.mode = 'g';
    if (!map.ammoPosition.length) {
      centerMove = logic.goToCenter(player, map);
      if (logic.isMovementSafe(centerMove, player, enemies, map)) return centerMove;
    } else {
      ammoMove = logic.shouldMoveForAmmo(player, enemies, map);
      if (ammoMove && logic.isMovementSafe(ammoMove, player, enemies, map)) return ammoMove;

      centerMove = logic.goToCenter(player, map);
      if (logic.isMovementSafe(centerMove, player, enemies, map)) return centerMove;
    }

    safestMove = logic.getSafestMove(player, enemies, map);
    if (safestMove && isMovementSafe(safestMove, player, enemies, map)) return safestMove;

    return utils.safeRandomMove();
  },

  _hunter: function(player, enemies, map) {
    var turnMove;
    var ammoMove;
    var chaseMove;
    var safestMove;

    codingpains.info.mode = 'h';

    enemies = logic.getDangerousEnemies(enemies);

    if (utils.canKill(player, enemies)) return 'shoot';

    turnMove = logic.turnToAmbush(player, enemies);
    if (turnMove) return turnMove;

    turnMove = logic.turnToKill(player, enemies);
    if (turnMove && logic.isMovementSafe(turnMove, player, enemies, map)) return turnMove;

    chaseMove = logic.chaseEnemy(player, enemies, map);
    if (chaseMove && logic.isMovementSafe(chaseMove, player, enemies, map)) return chaseMove;

    safestMove = logic.getSafestMove(player, enemies, map);
    if (safestMove) return safestMove;

    return false;
  },

  _eluder: function(player, enemies, map) {
    var killers = logic.getImmediateThreats(player, enemies);
    var closeThreats = {y: [], x:[]};
    codingpains.info.mode = 'e';
    if (killers.length) {
      if (logic.canKillAll(player, killers)) {
        return 'shoot';
      } else if (logic.isMovementSafe('move', player, killers, map)) {
        return 'move';
      } else {
        // Here I would activate a shield!, for now just die :(
        return false;
      }
    }

    if (player.ammo) return this._hunter(player, enemies, map);
    _.forEach(enemies, function(e) {
      if (logic.sameY(player.position, e.position)) {
        closeThreats.y.push(e);
      }
      if (logic.sameX(player.position, e.position)) {
        closeThreats.x.push(e);
      }
    });

    if (closeThreats.x.length) {
      if (player.ammo && utils.canKill(player, closeThreats.x)) return 'shoot';
      if (logic.isHorizontal(player.direction) && logic.canMoveTowards(player.direction, player, map)) {
        return 'move';
      } else {
        return logic.opositeDirection(closeThreats.x[0].direction);
      }
    } else {
      if (player.ammo && utils.canKill(player, closeThreats.y)) return 'shoot';
      if (logic.isVertical(player.direction) && logic.canMoveTowards(player.direction, player, map)) {
        return 'move';
      } else {
        return logic.opositeDirection(closeThreats.y[0].direction);
      }
    }

  }
};

module.exports = codingpains;
