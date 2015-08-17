var music = require('./../lib/sound-effects').music;
var PlayerClass = require('./PlayerClass.js');
var executeMovementHelper = require('./executeMovementHelper.js');

var DIRECTIONS = ['north', 'east', 'south', 'west'];

class ClashJS {
  constructor(playerDefinitionArray, evtCallback) {
    this._gameEnvironment = {
      gridSize: 13,
      ammoPosition: []
    };

    this._evtCallback = evtCallback;

    this._playerInstances = playerDefinitionArray.map((playerDefinition) => {
      return new PlayerClass(playerDefinition);
    });

    this._playerStates = this._playerInstances.map((playerInstance) => {
      return {
        style: playerInstance.getInfo().style,
        position: [Math.floor(Math.random() * this._gameEnvironment.gridSize), Math.floor(Math.random() * this._gameEnvironment.gridSize)],
        direction: DIRECTIONS[Math.floor(Math.random() * 4)],
        ammo: 0,
        isAlive: true
      };
    });

    this._currentPlayer = 0;
    this._musicTheme = music.theme0;
    this._musicTheme.loop = true;
    this._musicTheme.play();
    this._createAmmo();
  }

  _createAmmo() {
    var newAmmoPosition = [
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
      Math.floor(Math.random() * this._gameEnvironment.gridSize)
    ];

    if (this._gameEnvironment.ammoPosition.some(el => {
      return el[0] === newAmmoPosition[0] && el[1] === newAmmoPosition[1];
    })) {
      this._createAmmo();
      return;
    }

    this._gameEnvironment.ammoPosition.push(newAmmoPosition);
  }

  getState() {
    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances
    };
  }

  nextPly() {
    var otherPlayers = this._playerStates.filter((currentEnemyFilter, index) => {
      if (index === this._currentPlayer) return false;
      return currentEnemyFilter.isAlive;
    });

    if (this._playerStates[this._currentPlayer].isAlive) {
      this._savePlayerAction(
        this._currentPlayer,
        this._playerInstances[this._currentPlayer].execute(
          this._playerStates[this._currentPlayer],
          otherPlayers,
          this._gameEnvironment
        )
      );
    }

    this._currentPlayer = (this._currentPlayer + 1) % this._playerInstances.length;

    if (this._gameEnvironment.ammoPosition.length < this._playerStates.length / 2 && Math.random() > 0.95) this._createAmmo();

    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances
    };
  }

  nextStep() {
    this._playerInstances.forEach(() => {
      this.nextPly();
    });

    return {
      gameEnvironment: this._gameEnvironment,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances
    };
  }

  _savePlayerAction(playerIndex, playerAction) {
    this._playerStates = executeMovementHelper(
      playerIndex,
      playerAction,
      this._playerStates,
      this._gameEnvironment,
      this._evtCallback
    );
  }
}

module.exports = ClashJS;
