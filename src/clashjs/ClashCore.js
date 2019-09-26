const _ = require("lodash");

var PlayerClass = require("./PlayerClass.js");
var executeMovementHelper = require("./executeMovementHelper.js");

var DIRECTIONS = ["north", "east", "south", "west"];

const SUDDEN_DEATH_TURN = 60;

class ClashJS {
  constructor(playerDefinitionArray, currentStats) {
    const clashjsTarget = class ClashJSTarget extends EventTarget {};
    this.target = new clashjsTarget();

    this._totalRounds = playerDefinitionArray.length * 2 + 8;
    this._rounds = 0;
    this._gameStats = currentStats || {};
    this._evtCallback = (msg, data) => {
      this.target.dispatchEvent(new CustomEvent("DATA", { detail: { name: msg, data: data } }));
    };
    this._alivePlayerCount = 0;
    this._suddenDeathCount = 0;
    this._playerInstances = playerDefinitionArray.map(playerDefinition => {
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

  _getAlivePlayerCount() {
    return this._playerStates.reduce((result, el) => {
      return el.isAlive ? result + 1 : result;
    }, 0);
  }

  setupGame() {
    this._gameEnvironment = {
      gridSize: 13,
      ammoPosition: []
    };
    this._rounds++;
    this._suddenDeathCount = 0;
    this._playerInstances = _.shuffle(this._playerInstances);
    this._alivePlayerCount = this._playerInstances.length;
    this._playerStates = this._playerInstances.map(playerInstance => {
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
    this._createAmmo();
  }

  _createAmmo() {
    var newAmmoPosition = [
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
      Math.floor(Math.random() * this._gameEnvironment.gridSize)
    ];

    if (
      this._gameEnvironment.ammoPosition.some(el => {
        return el[0] === newAmmoPosition[0] && el[1] === newAmmoPosition[1];
      })
    ) {
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
    if (this._suddenDeathCount > SUDDEN_DEATH_TURN * this._getAlivePlayerCount()) {
      this._evtCallback("DRAW");
      this._handleCoreAction("DRAW");
    }
    let clonedStates = _.cloneDeep(this._playerStates, true);

    if (this._getAlivePlayerCount() < 2) {
      this._suddenDeathCount += 10;
    }

    if (this._getAlivePlayerCount() < 3) {
      this._suddenDeathCount++;
    }

    var otherPlayers = clonedStates.filter((currentEnemyFilter, index) => {
      if (index === this._currentPlayer) return false;
      return currentEnemyFilter.isAlive;
    });

    if (this._playerStates[this._currentPlayer].isAlive) {
      this._savePlayerAction(
        this._currentPlayer,
        this._playerInstances[this._currentPlayer].execute(
          clonedStates[this._currentPlayer],
          otherPlayers,
          _.cloneDeep(this._gameEnvironment, true)
        )
      );
    }

    this._currentPlayer = (this._currentPlayer + 1) % this._playerInstances.length;

    if (this._gameEnvironment.ammoPosition.length < this._playerStates.length / 1.2 && Math.random() > 0.92) {
      this._createAmmo();
    }

    if (Math.random() > 0.99) {
      this._createAmmo();
    }

    return this.getState();
  }

  _handleCoreAction(action, data) {
    if (action === "KILL") {
      let { killer, killed } = data;
      this._gameStats[killer.getId()].kills++;
      _.forEach(this._playerInstances, player => {
        let stats = this._gameStats[player.getId()];
        if (killed.indexOf(player) > -1) {
          this._alivePlayerCount--;
          stats.deaths++;
        }
        if (stats.deaths) {
          stats.kdr = stats.kills / stats.deaths;
        } else {
          stats.kdr = stats.kills;
        }
      });
      this._suddenDeathCount = 0;
    }
    if (action === "WIN") {
      this._gameStats[data.winner.getId()].wins++;
      _.forEach(this._gameStats, (playerStats, key) => {
        let { wins, winrate } = playerStats;
        playerStats.winrate = Math.round((wins * 100) / this._rounds);
      });

      if (this._rounds >= this._totalRounds) {
        return this._evtCallback("END");
      }
    }
    if (action === "DRAW") {
      _.forEach(this._gameStats, (playerStats, key) => {
        let { wins, winrate } = playerStats;
        playerStats.winrate = Math.round((wins * 100) / this._rounds);
      });
      if (this._rounds >= this._totalRounds) {
        return this._evtCallback("END");
      }
    }
  }

  _savePlayerAction(playerIndex, playerAction) {
    this._playerStates = executeMovementHelper({
      playerIndex: playerIndex,
      playerAction: playerAction,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances,
      gameEnvironment: this._gameEnvironment,
      evtCallback: this._evtCallback,
      coreCallback: this._handleCoreAction.bind(this)
    });
  }
}

module.exports = ClashJS;
