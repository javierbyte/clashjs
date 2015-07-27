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

    this._playerStates = this._playerInstances.map((playerInstance, playerInstanceIndex) => {
      return {
        style: playerInstanceIndex,
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
    this._playerInstances.forEach((playerInstance, playerInstanceIndex) => {
      this._savePlayerAction(
        playerInstanceIndex,
        playerInstance.execute(
          this._playerStates[playerInstanceIndex],
          this._playerStates,
          this._gameEnvironment
        )
      );
    });

    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }

  _savePlayerAction(playerIndex, action) {
    console.warn(playerIndex, action);
  }
}

module.exports = ClashJS;
