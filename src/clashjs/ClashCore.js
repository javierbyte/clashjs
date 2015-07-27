class ClashJS {
  constructor(options) {
    this.options = options;
  }

  getState() {
    return {
      world: {
        gridSize: 13,
        ammoPosition: []
      },
      players: [{
        style: 0,
        color: '#FF5722',
        position: [3, 5],
        direction: 0,
        ammo: 3
      }, {
        style: 1,
        color: '#CDDC39',
        position: [6, 5],
        direction: 1,
        ammo: 3
      }, {
        style: 2,
        color: '#03A9F4',
        position: [8, 8],
        direction: 2,
        ammo: 3
      }]
    };
  }
}

module.exports = ClashJS;
