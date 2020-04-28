import React from "react";
import _ from "lodash";
import fx from "./../lib/sound-effects";
import Tiles from "./Tiles.jsx";
import Ammos from "./Ammos.jsx";
import Players from "./Players.jsx";
import Stats from "./Stats.jsx";
import Shoots from "./Shoots.jsx";
import Notifications from "./Notifications.jsx";
import ControlPanel from "./ControlPanel.jsx";

import ClashJS from "../clashjs/ClashCore.js";

import * as playerObjects from "../Players.js";
var playerArray = _.shuffle(_.map(playerObjects, (el) => el));

var killsStack = [];

const DEFAULT_SPEED = 100;
const MAX_SPEED = 50;

class Clash extends React.Component {
  constructor(props) {
    super(props);

    window.ClashInstance = new ClashJS(
      playerArray,
      {},
      this.handleEvent.bind(this)
    );

    // window.ClashInstance.target.addEventListener("DATA", evt => {
    //   this.handleEvent(evt.detail.name, evt.detail.data);
    // });

    this.state = {
      running: false,
      sounds: true,
      clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: DEFAULT_SPEED,
      kills: [],
      currentGameIndex: 1,
      finished: false,
    };
    fx.enableSounds()
  }

  // componentDidMount() {
  //   if (this.state.startGame) {
  //     this.nextTurn();
  //   }
  // }

  handleClick() {
    this.setState({
      speed: Math.floor(this.state.speed * 0.9),
    });
    this.nextTurn();
  }

  handleToggleRunning() {
    this.setState(
      (prevState) => {
        return {
          running: !prevState.running,
        };
      },
      () => {
        if (this.state.running) this.nextTurn();
      }
    );
  }

  handleToggleSounds() {
    this.setState(
      (prevState) => ({
        sounds: !prevState.sounds,
      }),
      () => {
        this.state.sounds ? fx.enableSounds() : fx.disableSounds()
      }
    );
  }

  newGame() {
    killsStack = [];

    if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout);

    window.ClashInstance.setupGame();

    this.setState(
      (state) => {
        return {
          clashjs: window.ClashInstance.getState(),
          speed: DEFAULT_SPEED,
          kills: [],
          currentGameIndex: state.currentGameIndex + 1,
        };
      },
      () => {
        if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout);
        window.setTimeout(() => {
          this.nextTurn();
        }, 50);
      }
    );
  }

  nextTurn() {
    console.log("next turn");
    if (!this.state.running || this.state.finished) return;

    var currentGameIndex = this.state.currentGameIndex;

    if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout);

    this.nextTurnTimeout = window.setTimeout(() => {
      if (this.state.currentGameIndex !== currentGameIndex) return;

      var { playerStates } = window.ClashInstance.getState();
      var alivePlayerCount = playerStates.reduce((result, el) => {
        return el.isAlive ? result + 1 : result;
      }, 0);

      if (alivePlayerCount < 2) {
        window.ClashInstance.nextPly();
        this.nextTurn();
        return;
      }

      window.ClashInstance.nextPly();

      this.setState(
        {
          clashjs: window.ClashInstance.getState(),
          speed:
            this.state.speed > MAX_SPEED
              ? parseInt(this.state.speed * 0.99, 10)
              : MAX_SPEED,
        },
        this.nextTurn
      );
    }, this.state.speed);
  }

  handleEvent(evt, data) {
    console.log("handleEvent", evt);
    if (evt === "SHOOT") {
      let newShoots = this.state.shoots;
      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime(),
      });

      this.setState({
        shoots: newShoots,
      });
    }
    if (evt === "WIN") return this.newGame();
    if (evt === "DRAW") return this.newGame();
    if (evt === "KILL") return this._handleKill(data);
    if (evt === "END") return this.endGame();
  }

  _handleKill(data) {
    let players = window.ClashInstance.getState().playerInstances;
    let kills = this.state.kills;
    let killer = players[data.killer];
    let killed = _.map(data.killed, (index) => {
      killsStack.push(data.killer);
      killer.kills++;
      players[index].deaths++;
      return players[index];
    });
    let notification = [
      killer.getName(),
      "killed",
      _.map(killed, (player) => player.getName()).join(","),
    ].join(" ");

    kills.push({ date: new Date(), text: notification });
    this.setState({
      kills: kills,
    });

    setTimeout(() => this.handleStreak(data.killer, killer, killed), 100);
  }

  endGame() {
    this.setState({
      clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: 0,
      kills: [],
      finished: true,
    });
  }

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length;
    let multiKill = "";
    let spreeMessage = "";
    let kills = this.state.kills;
    if (killsStack.length === 1) {
      fx.playSound(fx.streak.firstBlood);
    }

    switch (killed.length) {
      case 2:
        fx.playSound(fx.streak.doubleKill);
        multiKill = killer.getName() + " got a double kill!";
        break;
      case 3:
        fx.playSound(fx.streak.tripleKill);
        multiKill = killer.getName() + " got a Triple Kill!";
        break;
      case 4:
        fx.playSound(fx.streak.monsterKill);
        multiKill = killer.getName() + " is a MONSTER KILLER!";
        break;
      default:
        break;
    }
    kills.push({
      date: new Date(),
      text: multiKill,
    });

    switch (streakCount + Math.floor(Math.random() * 3)) {
      case 3:
        fx.playSound(fx.streak.killingSpree);
        spreeMessage = killer.getName() + " is on a killing spree!";
        break;
      case 4:
        fx.playSound(fx.streak.dominating);
        spreeMessage = killer.getName() + " is dominating!";
        break;
      case 5:
        fx.playSound(fx.streak.rampage);
        spreeMessage = killer.getName() + " is on a rampage of kills!";
        break;
      default:
        fx.playSound(fx.streak.ownage);
        spreeMessage = `Can anyone stop ${killer.getName()}?!?`;
    }
    if (Math.random() > 0.5)
      kills.push({ date: new Date(), text: spreeMessage });
    this.setState({
      kills: kills,
    });
  }

  render() {
    var { clashjs, shoots, kills, finished, running, sounds } = this.state;
    var {
      gameEnvironment,
      gameStats,
      playerStates,
      playerInstances,
      rounds,
      totalRounds,
    } = clashjs;

    gameEnvironment = gameEnvironment || {
      gridSize: 13,
    };

    _.forEach(playerInstances, (player, index) => {
      gameStats[player.getId()].isAlive = playerStates[index].isAlive;
    });

    const notification = [...kills];

    if (finished) {
      const winner = _.sortBy(
        gameStats,
        (playerStats) => playerStats.wins * -1
      )[0];
      notification.push({
        date: new Date(),
        text: (
          <b style={{ color: "#0e0", fontWeight: 700 }}>
            Congrats {winner.name}!
          </b>
        ),
      });
      notification.push({
        date: new Date(),
        text: "Refresh the page to start again",
      });
    }

    return (
      <div className="clash" onClick={this.handleClick.bind(this)}>
        <Tiles gridSize={gameEnvironment.gridSize} />
        <Shoots shoots={shoots.slice()} gridSize={gameEnvironment.gridSize} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition}
        />
        <Players
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates}
        />
        {!!notification.length && <Notifications kills={notification} />}
        <Stats
          rounds={rounds}
          total={totalRounds}
          playerStates={playerStates}
          stats={gameStats}
        />

        <ControlPanel
          running={running}
          sounds={sounds}
          handleToggleRunning={this.handleToggleRunning.bind(this)}
          handleToggleSounds={this.handleToggleSounds.bind(this)}
        />
        {false && (
          <pre className="debugger">{JSON.stringify(playerStates, 0, 2)}</pre>
        )}
      </div>
    );
  }
}

export default Clash;
