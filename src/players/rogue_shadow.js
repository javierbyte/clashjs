import utils from '../lib/utils.js';

function closest (from, locations) {
  let closest = locations.reduce((result, to) => {
    let distance = utils.getDistance(from, to);

    if (distance < result.distance) {
      result.position = to;
      result.distance = distance;
    }

    return result;

  }, { position: [], distance: 200 });

  return closest.position;
}

function moveTo (me, position) {
    let directionTo = utils.fastGetDirection(me.position, position);

    if (directionTo !== me.direction) {
      return directionTo;
    }

    return 'move';
}

function equal (a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

export default {

  info: {
    name: 'Rogue Shadow',
    style: 1
  },

  ai: (me, ships, game) => {
    if (utils.canKill(me, ships) && me.ammo) {
        return 'shoot';
    }

    if (me.ammo === 0 && game.ammoPosition.length) {
      return moveTo(me, closest(me.position, game.ammoPosition));
    }

    let safe = ships.filter((ship) => {
      return ship.ammo === 0;
    });

    if (safe.length === 0) {
      safe = ships;
    }

    let target = closest(me.position, safe.map((ship) => ship.position));
    return moveTo(me, target);
  }
}
