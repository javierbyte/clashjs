var randomMove = () => {
  var movements = ['north', 'east', 'south', 'west'];

  return Math.random() > 0.33 ? 'move' : movements[Math.floor(Math.random() * movements.length)];
};

module.exports = [{
  info: {
    name: 'javierbyte',
    style: 0,
    color: '#FF5722'
  },
  ai: () => {
    return randomMove();
  }
}, {
  info: {
    name: 'manuelmhtr',
    style: 1,
    color: '#CDDC39'
  },
  ai: () => {
    return randomMove();
  }
}, {
  info: {
    name: 'codingpains',
    style: 2,
    color: '#03A9F4'
  },
  ai: () => {
    return randomMove();
  }
}, {
  info: {
    name: 'ericku',
    style: 3,
    color: '#fff'
  },
  ai: () => {
    return randomMove();
  }
}];
