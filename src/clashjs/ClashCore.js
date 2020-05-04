import _ from "lodash";

import PlayerClass from "./PlayerClass.js";
import executeMovementHelper from "./executeMovementHelper.js";

var DIRECTIONS = ["north", "east", "south", "west"];

const GRID_SIZE = 6;
const SUDDEN_DEATH_TURN = 100;
let asteroidsOn = true;
let cargoOn = true;

let allPositions = []

class ClashJS {
  constructor(playerDefinitionArray, currentStats, evtCallback) {
    // const clashjsTarget = class ClashJSTarget extends EventTarget {};
    // this.target = new clashjsTarget();

    this._totalRounds = playerDefinitionArray.length * 2 + 6;
    this._rounds = 0;
    this._gameStats = currentStats || {};
    this._evtCallback = (msg, data) => {
      // this.target.dispatchEvent(new CustomEvent("DATA", { detail: { name: msg, data: data } }));
      evtCallback(msg, data);
    };
    this._alivePlayerCount = 0;
    this._suddenDeathCount = 0;
    this._playerInstances = playerDefinitionArray.map((playerDefinition) => {
      let player = new PlayerClass(playerDefinition);
      this._gameStats[player.getId()] = {
        name: player.getName(),
        deaths: 0,
        kills: 0,
        kdr: 0,
        wins: 0,
        winrate: 0,
        cargo: 0,
        turns: 0,
        calcTime: 0,
        actions: {
          "move": 0,
          "shoot": 0,
          "turn": 0,
          "north": 0,
          "east": 0,
          "south": 0,
          "west": 0,
          "wait": 0
        }
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
    // console.log('setupGame')
    this._gameEnvironment = {
      gridSize: GRID_SIZE,
      ammoPosition: [],
      cargos: [],
      asteroids: [],
    };
    allPositions = _.flatten(_.range(GRID_SIZE).map(x => _.range(GRID_SIZE).map(y => ([x, y]))))
    // console.log('allPosition', allPositions)
    this._rounds++;
    this._suddenDeathCount = 0;
    this._playerInstances = _.shuffle(this._playerInstances);
    this._alivePlayerCount = this._playerInstances.length;
    this._playerStates = this._playerInstances.map((playerInstance) => {
      let gridSize = this._gameEnvironment.gridSize;
      return {
        style: playerInstance.getInfo().style || _.random(110),
        position: [
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ],
        direction: DIRECTIONS[Math.floor(Math.random() * 4)],
        ammo: 0,
        isAlive: true,
        id: playerInstance.getId(),
        name: playerInstance.getName(),
      };
    });

    this._currentPlayer = 0;
    this._createAmmo();
    this._createCargo();
    // console.log('setupGame end', this.getState())
  }

  _createAmmo() {
    if (
      this._gameEnvironment.ammoPosition.length ===
      Math.pow(this._gameEnvironment.gridSize, 2)
    ) {
      console.log("Out of places to create ammo, skipping ...");
      return;
    }
    var newAmmoPosition = [
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
    ];

    if (
      this._gameEnvironment.ammoPosition.some((el) => {
        return el[0] === newAmmoPosition[0] && el[1] === newAmmoPosition[1];
      })
    ) {
      this._createAmmo();
      return;
    }

    this._gameEnvironment.ammoPosition.push(newAmmoPosition);
  }

  _createCargo() {
    if (!cargoOn) return
    // find open spaces with no ammo and no players
    const open = this._findOpenPositions()
    if (!open.length) {
      console.log("Out of places to create cargo, skipping ...");
      return;
    }
    var newCargo = {
      type: _.random(15),
      value: _.random(1, 5),
      position: _.sample(open)
    };

    if (
      this._gameEnvironment.cargos.some((el) => {
        return el[0] === newCargo.position[0] && el[1] === newCargo.position[1];
      })
    ) {
      this._createCargo();
      return;
    }

    this._gameEnvironment.cargos.push(newCargo);
  }

  _randomPosition() {
    return [
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
      Math.floor(Math.random() * this._gameEnvironment.gridSize),
    ];
  }

  _createAsteroids() {
    const numAsteroids = Math.floor(
      Math.pow(this._gameEnvironment.gridSize, 2) * 0.01
    );

    for (let i = 0; i < numAsteroids; i++) {
      this._gameEnvironment.asteroids.push({
        position: this._randomPosition(),
        detonateIn: Math.floor(Math.random() * (8 - 3)) + 3,
        style: 7,
      });
    }

    console.log("*** Incoming asteroids", this._gameEnvironment.asteroids);
  }

  _createAsteroids2() {
    const alivePlayers = this._playerStates.filter((p) => p.isAlive);

    if (alivePlayers.length > 3) {
      const numAsteroids = Math.min(_.random(Math.floor(
        Math.pow(this._gameEnvironment.gridSize, 2) * 0.1
      )), 4);

      for (let i = 0; i < numAsteroids; i++) {
        this._gameEnvironment.asteroids.push({
          position: this._randomPosition(),
          detonateIn: 3 + _.random(3),
          style: 7,
        });
        console.log('*** new random asteroid')

      }
    } else {
      // TARGET ASTEROIDS
      const numAsteroids = _.random(alivePlayers.length)
      for (let i = 0; i < numAsteroids; i++) {
        const adjoiningPositions = this._findAdjoiningPositions(
          alivePlayers[i].position
        );
        this._gameEnvironment.asteroids.push({
          position: _.sample(adjoiningPositions),
          detonateIn: 3 + _.random(3),
          style: 7,
        });
        console.log('*** new targeted asteroid')
      }
    }

    console.log("*** Incoming asteroids", this._gameEnvironment.asteroids);
  }

  getState() {
    return {
      gameEnvironment: this._gameEnvironment,
      gameStats: this._gameStats,
      rounds: this._rounds,
      totalRounds: this._totalRounds,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances,
    };
  }

  nextPly() {
    // console.log('nextply', this._currentPlayer, this.getState())

    // this._suddenDeathCount > 0 && console.log('_suddenDeathCount', this._suddenDeathCount)
    if (this._suddenDeathCount > SUDDEN_DEATH_TURN * this._getAlivePlayerCount()) {
      this._evtCallback("DRAW");
      this._handleCoreAction("DRAW");
    }
    let clonedStates = _.cloneDeep(this._playerStates, true);

    if (this._getAlivePlayerCount() < 2) {
      this._suddenDeathCount += 10;
    }

    if (this._getAlivePlayerCount() < 5) {
      this._suddenDeathCount += 1 / this._getAlivePlayerCount();
    }

    var otherPlayers = clonedStates.filter((currentEnemyFilter, index) => {
      if (index === this._currentPlayer) return false;
      return currentEnemyFilter.isAlive;
    });

    if (this._playerStates[this._currentPlayer].isAlive) {
      const t0 = performance.now()
      const playerAction = this._playerInstances[this._currentPlayer].execute(
        clonedStates[this._currentPlayer],
        otherPlayers,
        _.cloneDeep(this._gameEnvironment, true)
      )
      const t1 = performance.now()
      // console.log('player action', this._currentPlayer, playerAction)
      this._savePlayerAction(
        this._currentPlayer,
        playerAction
      );
      const playerId = this._playerInstances[this._currentPlayer]._id
      this._gameStats[playerId].calcTime += (t1 - t0)
      this._gameStats[playerId].turns++
    }
    // console.log('setting to next player')
    this._currentPlayer = (this._currentPlayer + 1) % this._playerInstances.length;

    if (this._currentPlayer === 0) {
      console.log(
        "*** New Loop",
        JSON.stringify(this._gameEnvironment.asteroids)
      );

      if (asteroidsOn && Math.random() < 0.33) {
        this._createAsteroids2();
      }

      // decrement all asteroid timers

      this._gameEnvironment.asteroids.forEach((asteroid, index, array) => {
        // console.log('*** decrementing detonateIn for ', asteroid.position, asteroid.detonateIn)
        asteroid.detonateIn--;
        if (asteroid.detonateIn === 0) {
          asteroid.style = _.random(10, 15);

          // blow the thing up
          console.log("*** detonating asteroid", asteroid);
          this._playerStates.forEach((player) => {
            if (
              player.isAlive &&
              asteroid.position[0] === player.position[0] &&
              asteroid.position[1] === player.position[1]
            ) {
              console.log("&&& asteroid killed player", player.name);
              // debugger;
              this._handleCoreAction("DESTROY", { player });
            }
          });
        }
      });
      // clear out detonated asteroids
      this._gameEnvironment.asteroids = this._gameEnvironment.asteroids.filter(
        (asteroid) => asteroid.detonateIn > -5
      );

      console.log(
        "*** asteroids after detonate",
        JSON.stringify(this._gameEnvironment.asteroids)
      );
      const survivors = _.filter(
        this._playerStates,
        (player) => player.isAlive
      );
      if (!survivors.length) {
        this._handleCoreAction("DRAW");
        this._evtCallback("DRAW");
      }

      if (survivors.length === 1) {
        console.log("survivor", survivors[0]);
        this._handleCoreAction("WIN", {
          winner: { getId: () => survivors[0].id },
        });
        this._evtCallback("WIN", {
          winner: { getId: () => survivors[0].id },
        });
      }
    }

    if (
      this._gameEnvironment.ammoPosition.length <
      this._playerStates.length / 1.2 &&
      Math.random() > 0.92
    ) {
      this._createAmmo()
      this._createCargo()
    }

    // if (Math.random() > 0.98) {
    //   this._createAmmo();
    // }

    return this.getState();
  }

  _handleCoreAction(action, data) {
    if (action === "CARGO") {
      console.log("*** core action CARGO", data);
      const { player, cargo } = data;
      let stats = this._gameStats[player.id];
      stats.cargo += cargo.value;
    }
    if (action === "DESTROY") {
      console.log("*** core action DESTROY", data);
      const { player } = data;
      player.isAlive = false;
      let stats = this._gameStats[player.id];
      stats.deaths++;

      this._alivePlayerCount--;
      this._suddenDeathCount = 0;
      this._evtCallback(action, data);
    }
    if (action === "KILL") {
      let { killer, killed } = data;
      this._gameStats[killer.getId()].kills++;
      _.forEach(this._playerInstances, (player) => {
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
        let { wins } = playerStats;
        playerStats.winrate = Math.round((wins * 100) / this._rounds);
      });

      if (this._rounds >= this._totalRounds) {
        return this._evtCallback("END");
      }
    }
    if (action === "DRAW") {
      _.forEach(this._gameStats, (playerStats, key) => {
        let { wins } = playerStats;
        playerStats.winrate = Math.round((wins * 100) / this._rounds);
      });
      if (this._rounds >= this._totalRounds) {
        return this._evtCallback("END");
      }
    }
  }

  _savePlayerAction(playerIndex, playerAction) {
    const playerId = this._playerInstances[playerIndex]._id
    const action = playerAction ? playerAction : 'wait'
    this._gameStats[playerId].actions[action]++
    if (DIRECTIONS.includes(playerAction)) {
      this._gameStats[playerId].actions.turn++
    }
    this._playerStates = executeMovementHelper({
      playerIndex: playerIndex,
      playerAction: playerAction,
      playerStates: this._playerStates,
      playerInstances: this._playerInstances,
      gameEnvironment: this._gameEnvironment,
      evtCallback: this._evtCallback,
      coreCallback: this._handleCoreAction.bind(this),
    });
  }

  _findAdjoiningPositions(position) {
    const [x, y] = position;
    const gridSize = this._gameEnvironment.gridSize;
    const adjoining = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];
    return adjoining.filter(
      ([x, y]) => x >= 0 && x < gridSize && y >= 0 && y < gridSize
    );
  }

  _findOpenPositions() {
    const ammos = this._gameEnvironment.ammoPosition
    const playerPositions = this._playerStates.map(player => player.position)
    const cargoPositions = this._gameEnvironment.cargos.filter(cargo => cargo.position)
    const result = _.differenceWith(allPositions, _.concat(playerPositions, ammos, cargoPositions), _.isEqual);
    // console.log('findOpenPositions', result.length, playerPositions.length, ammos.length, cargoPositions.length)
    // console.log('findOpenPositions', result, playerPositions, ammos, cargoPositions)
    return result
  }

  setAsteroidsOn(value) {
    // console.log('setAsteroidsOn', value, asteroidsOn)
    asteroidsOn = value
  }
  setCargoOn(value) {
    // console.log('setCargoOn', value, cargoOn)
    cargoOn = value
  }
}

export default ClashJS;
