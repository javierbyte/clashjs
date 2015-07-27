var PlayerClass = require('./PlayerClass.js');

class ClashJS {
  constructor(playerDefinitionArray) {
    this._gameEnvironment = {
      gridSize: 15,
      ammoPosition: []
    };

    this._playerInstances = playerDefinitionArray.map((playerDefinition) => {
      return new PlayerClass(playerDefinition);
    });

    this._playerStates = this._playerInstances.map((playerInstance, index) => {
      return {
        style: index,
        position: [Math.floor(Math.random() * this._gameEnvironment.gridSize), Math.floor(Math.random() * this._gameEnvironment.gridSize)],
        direction: Math.floor(Math.random() * 4),
        ammo: 0,
        color: playerInstance.getInfo().color
      };
    });
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
