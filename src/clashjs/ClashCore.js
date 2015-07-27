var PlayerClass = require('./PlayerClass.js');
var executeMovementHelper = require('./executeMovementHelper.js');

class ClashJS {
  constructor(playerDefinitionArray) {
    this._gameEnvironment = {
      gridSize: 13,
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

    this._currentPlayer = 0;
  }

  getState() {
    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }

  nextPly() {
    this._savePlayerAction(
      this._currentPlayer,
      this._playerInstances[this._currentPlayer].execute(
        this._playerStates[this._currentPlayer],
        this._playerStates.slice(this._currentPlayer, 1),
        this._gameEnvironment
      )
    );

    this._currentPlayer = (this._currentPlayer + 1) % this._playerInstances.length;

    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }

  nextStep() {
    this._playerInstances.forEach(() => {
      this.nextPly();
    });

    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates
    };
  }

  _savePlayerAction(playerIndex, playerAction) {
    this._playerStates = executeMovementHelper(
      playerIndex,
      playerAction,
      this._playerStates,
      this._gameEnvironment
    );
  }
}

module.exports = ClashJS;
