import _ from "lodash";

import PlayerClass from "./PlayerClass.js";
import executeMovementHelper from "./executeMovementHelper.js";

import EventEmitter from "wolfy87-eventemitter";

const DIRECTIONS = ["north", "east", "south", "west"];
const TOTAL_ROUNDS = 7;
const SUDDEN_DEATH_PLY = 200;

const ClashEmitter = new EventEmitter();

let STATE = {
  running: false,

  currentPlayer: 0,

  gameEnvironment: {
    gridSize: 13,
    ammoPosition: [],
  },
  suddenDeathCount: 0,
  totalRounds: TOTAL_ROUNDS,
  rounds: 0,

  playerInstances: [],
  playerStates: [],

  playerDefinition: {},
  gameStats: {},
};

function ClashJS(playerDefinitionArray) {
  STATE.playerInstances = playerDefinitionArray.map((playerDefinition) => {
    const player = new PlayerClass(playerDefinition);
    STATE.gameStats[player.id] = {
      id: player.id,
      name: player.name,
      kills: 0,
      wins: 0,
    };
    return player;
  });

  function emit(name, payload) {
    console.info("ClashCore: Emit", { name, payload });
    ClashEmitter.emit("CLASHJS", { name, payload });
  }

  function handleExecuteMovementCallback(event, payload) {
    emit(event, payload);
  }

  function handleCoreAction(action, data) {
    if (action === "KILL") {
      let { killer, killed } = data;

      STATE.gameStats[killer.id].kills += killed.length;

      _.forEach(STATE.playerInstances, (player) => {
        let stats = STATE.gameStats[player.id];
        if (killed.indexOf(player) > -1) {
          STATE.alivePlayerCount--;
          stats.deaths++;
        }
        if (stats.deaths) {
          stats.kdr = stats.kills / stats.deaths;
        } else {
          stats.kdr = stats.kills;
        }
      });
      STATE.suddenDeathCount = 0;
    }
    if (action === "WIN") {
      STATE.gameStats[data.winner.id].wins++;
      STATE.suddenDeathCount = 0;

      if (STATE.rounds >= STATE.totalRounds) {
        emit("GAME_OVER");
        return;
      }
    }
    if (action === "DRAW") {
      STATE.suddenDeathCount = 0;

      if (STATE.rounds >= STATE.totalRounds) {
        emit("GAME_OVER");
        return;
      }
    }
  }

  function savePlayerAction(playerIndex, playerAction) {
    STATE.playerStates = executeMovementHelper({
      playerIndex: playerIndex,
      playerAction: playerAction,
      playerStates: STATE.playerStates,
      playerInstances: STATE.playerInstances,
      gameEnvironment: STATE.gameEnvironment,
      evtCallback: handleExecuteMovementCallback,
      coreCallback: handleCoreAction,
    });
  }

  function createAmmo() {
    const newAmmoPosition = [
      Math.floor(Math.random() * STATE.gameEnvironment.gridSize),
      Math.floor(Math.random() * STATE.gameEnvironment.gridSize),
    ];

    if (
      STATE.gameEnvironment.ammoPosition.some((el) => {
        return el[0] === newAmmoPosition[0] && el[1] === newAmmoPosition[1];
      })
    ) {
      createAmmo();
      return;
    }

    STATE.gameEnvironment.ammoPosition.push(newAmmoPosition);
  }

  return {
    newGame() {
      STATE.gameEnvironment = {
        gridSize: 13,
        ammoPosition: [],
      };
      STATE.rounds = STATE.rounds + 1;
      STATE.suddenDeathCount = 0;
      STATE.playerInstances = _.shuffle(_.cloneDeep(STATE.playerInstances));
      STATE.playerStates = STATE.playerInstances.map((playerInstance) => {
        const gridSize = STATE.gameEnvironment.gridSize;
        const directionAngle = Math.floor(Math.random() * 4);

        return {
          name: playerInstance.name,
          id: playerInstance.id,
          style: playerInstance.info.style,
          position: [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)],
          direction: DIRECTIONS[directionAngle],
          directionAngle: directionAngle,
          ammo: 0,
          isAlive: true,
        };
      });
      STATE.currentPlayer = 0;
      STATE = { ...STATE };
      createAmmo();
    },

    getAlivePlayerCount() {
      return STATE.playerStates.filter((player) => player.isAlive).length;
    },

    getState() {
      const derivedStats = STATE.gameStats;

      for (const playerKey in derivedStats) {
        const player = derivedStats[playerKey];
        player.score = player.wins * 5 + player.kills;
        player.isAlive = STATE.playerStates.find(
          (playerState) => playerState.id === playerKey
        ).isAlive;
      }

      return JSON.parse(
        JSON.stringify({
          gameEnvironment: STATE.gameEnvironment,
          gameStats: derivedStats,
          rounds: STATE.rounds,
          totalRounds: STATE.totalRounds,
          playerStates: STATE.playerStates,
          playerInstances: STATE.playerInstances,
        })
      );
    },

    nextPly() {
      let clonedStates = _.cloneDeep(STATE.playerStates);

      STATE.suddenDeathCount++;

      if (STATE.suddenDeathCount === SUDDEN_DEATH_PLY - 30) {
        emit("PRE_DRAW");
      }

      if (STATE.suddenDeathCount > SUDDEN_DEATH_PLY) {
        emit("DRAW");
        if (STATE.rounds >= STATE.totalRounds) {
          emit("GAME_OVER");
          return;
        }
      }

      const otherPlayers = clonedStates.filter((currentEnemyFilter, index) => {
        if (index === STATE.currentPlayer) return false;
        return currentEnemyFilter.isAlive;
      });

      if (STATE.playerStates[STATE.currentPlayer].isAlive) {
        savePlayerAction(
          STATE.currentPlayer,
          STATE.playerInstances[STATE.currentPlayer].execute(
            clonedStates[STATE.currentPlayer],
            otherPlayers,
            _.cloneDeep(STATE.gameEnvironment)
          )
        );
      }

      STATE.currentPlayer = (STATE.currentPlayer + 1) % STATE.playerInstances.length;

      if (
        STATE.gameEnvironment.ammoPosition.length < STATE.playerStates.length / 1.3 &&
        Math.random() > 0.93
      ) {
        createAmmo();
      }

      if (Math.random() > 0.98) {
        createAmmo();
      }

      return this.getState();
    },

    addListener(callback) {
      ClashEmitter.addListener("CLASHJS", callback);
    },
  };
}

export default ClashJS;
