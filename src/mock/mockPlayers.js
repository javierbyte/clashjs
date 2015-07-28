var movements = ['north', 'east', 'south', 'west'];

var randomMove = () => {
  return Math.random() > 0.33 ? 'move' : movements[Math.floor(Math.random() * movements.length)];
};

var getDirection = (start, end) => {
  var diffVertical = Math.abs(start[0] - end[0]);
  var diffHorizontal = Math.abs(start[1] - end[1]);

  if (diffVertical > diffHorizontal) {
    return (start[0] - end[0] > 0) ? 'north' : 'south';
  }
  return (start[1] - end[1] > 0) ? 'west' : 'east';
};

module.exports = [{
  info: {
    name: 'javierbyte',
    style: 0
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    var directionToAmmo;

    if (gameEnvironment.ammoPosition.length) {
      directionToAmmo = getDirection(playerState.position, gameEnvironment.ammoPosition[0]);

      if (directionToAmmo !== playerState.direction) return directionToAmmo;
      return 'move';
    }

    return randomMove();
  }
}, {
  info: {
    name: 'manuelmhtr',
    style: 1
  },
  ai: () => {
    return randomMove();
  }
}, {
  info: {
    name: 'codingpains',
    style: 2
  },
  ai: () => {
    return randomMove();
  }
}, {
  info: {
    name: 'ericku',
    style: 3
  },
  ai: () => {
    return randomMove();
  }
}];
