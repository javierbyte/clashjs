var music = require('./../lib/sound-effects').music;
var PlayerClass = require('./PlayerClass.js');
var executeMovementHelper = require('./executeMovementHelper.js');

var DIRECTIONS = ['north', 'east', 'south', 'west'];

class ClashJS {
  constructor(playerDefinitionArray, currentStats, evtCallback) {
    this._gameEnvironment = {
      gridSize: 13,
      ammoPosition: []
    };
    this._totalRounds = playerDefinitionArray.length * 10;
    this._rounds = 0;
    this._gameStats = currentStats || {};
    this._evtCallback = evtCallback;

    this._playerInstances = playerDefinitionArray.map((playerDefinition) => {
      let player = new PlayerClass(playerDefinition);
      this._gameStats[player.getId()] = {
        name: player.getName(),
        deaths: 0,
        kills: 0,
        kdr: 0,
        wins: 0,
        winrate: 0
      };
      return player;
    });

    this.setupGame();
  }

  setupGame() {
    this._rounds++;
    this._playerStates = this._playerInstances.map((playerInstance, index) => {
      let gridSize = this._gameEnvironment.gridSize;

      return {
        style: playerInstance.getInfo().style,
        position: [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)],
        direction: DIRECTIONS[Math.floor(Math.random() * 4)],
        ammo: 0,
        isAlive: true
      };
    });

    this._currentPlayer = 0;
    // this._musicTheme = music.theme0;
    // this._musicTheme.loop = true;
    // this._musicTheme.volume = 0.5;
    // this._musicTheme.play();
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
      gameStats: this._gameStats,
      rounds: this._rounds,
      totalRounds: this._totalRounds,
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

    return this.getState();
  }

  nextStep() {
    this._playerInstances.forEach(() => {
      this.nextPly();
    });

    return {
      gameEnvironment: this._gameEnvironment,
      gameStats: this._gameStats,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances
    };
  }

  _handleCoreAction(action, data) {
    if (action === 'KILL') {
      let {killer, killed} = data;
      this._gameStats[killer.getId()].kills++
      _.forEach(this._playerInstances, (player) => {
        let stats = this._gameStats[player.getId()];
        if (killed.indexOf(player) > -1) {
          stats.deaths++;
        }
        if (stats.deaths) {
          stats.kdr = stats.kills / stats.deaths;
        } else {
          stats.kdr = stats.kills;
        }
      });
    }
    if (action === 'WIN') {
      this._gameStats[data.winner.getId()].wins++;
      _.forEach(this._gameStats, (playerStats, key) => {
        let {wins, winrate} = playerStats;
        playerStats.winrate = Math.round(wins * 100 / this._rounds);
      });
    }
  }

  _savePlayerAction(playerIndex, playerAction) {
    this._playerStates = executeMovementHelper(
      {
        playerIndex: playerIndex,
        playerAction: playerAction,
        playerStates: this._playerStates,
        playerInstances: this._playerInstances,
        gameEnvironment: this._gameEnvironment,
        evtCallback: this._evtCallback,
        coreCallback: this._handleCoreAction.bind(this)
      }
    );
  }
}

module.exports = ClashJS;
