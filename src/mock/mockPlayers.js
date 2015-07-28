var randomMove = () => {
  var movements = ['north', 'east', 'south', 'west'];

  return Math.random() > 0.33 ? 'move' : movements[Math.floor(Math.random() * movements.length)];
};

module.exports = [{
  info: {
    name: 'javierbyte',
    style: 0
  },
  ai: () => {
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
