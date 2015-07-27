class ClashJS {
  constructor() {
    this._gameEnvironment = {
      gridSize: 13,
      ammoPosition: []
    };

    this._playerStates = [{
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
    }];
  }

  getState() {
    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }

  nextStep() {
    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }
}

module.exports = ClashJS;
