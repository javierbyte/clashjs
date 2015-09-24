import utils from '../lib/utils.js';

const goals = [
  [0, 0],
  [12, 0],
  [12, 12],
  [0, 12],
];

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

function equal (a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

export default {

  info: {
    name: 'Rogue Shadow',
    style: 1
  },

  ai: (me, baddies, game) => {
    if (utils.canKill(me, baddies) && me.ammo) {
        return 'shoot';
    }

    if (me.ammo === 0 && game.ammoPosition.length) {
      let directionToAmmo = utils.fastGetDirection(
        me.position,
        closest(me.position, game.ammoPosition)
      );

      if (directionToAmmo !== me.direction) {
        return directionToAmmo;
      }

      return 'move';
    }

    var corner = closest(me.position, goals)

    if (equal(me.position, corner)) {

      if (equal(corner, [0, 0])) {
        if (me.direction === 'south') {
          return 'east';
        }
        if (me.direction === 'east') {
          return 'south';
        }
        return 'south';
      }
      if (equal(corner, [0, 12])) {
        if (me.direction === 'north') {
          return 'west';
        }
        if (me.direction === 'west') {
          return 'north';
        }
        return 'north';
      }
      if (equal(corner, [12, 12])) {
        if (me.direction === 'south') {
          return 'west';
        }
        if (me.direction === 'west') {
          return 'south';
        }
        return 'west';
      }
      if (equal(corner, [12, 0])) {
        if (me.direction === 'north') {
          return 'east';
        }
        if (me.direction === 'east') {
          return 'north';
        }
        return 'east';
      }

    } else {
      var direction = utils.fastGetDirection(me.position, corner);

      if (me.direction !== direction) {
        return direction;
      } 

      return 'move';
    }
  }
}
