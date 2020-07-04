import React from "react";
import _ from "lodash";
import Tiles from "./Tiles.js";
import Ammos from "./Ammos.js";
import Players from "./Players.js";
import Stats from "./Stats.js";
import Shoots from "./Shoots.js";
import Notifications from "./Notifications.js";

import ClashJS from "../clashjs/ClashCore.js";

import playerObjects from "../Players.js";
var playerArray = _.shuffle(_.map(playerObjects, (el) => el));

var killsStack = [];

// const DEFAULT_SPEED = 200;
const DEFAULT_SPEED = 200;
const MAX_SPEED = 60;

class Clash extends React.Component {
  constructor(props) {
    super(props);

    window.ClashInstance = new ClashJS(playerArray, {}, this.handleEvent.bind(this));

    // window.ClashInstance.target.addEventListener("DATA", evt => {
    //   this.handleEvent(evt.detail.name, evt.detail.data);
    // });

    this.state = {
      clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: DEFAULT_SPEED,
      notifications: [],
      currentGameIndex: 1,
      finished: false,
    };
  }

  componentDidMount() {
    this.nextTurn();
  }

  handleClick() {
    this.setState({
      speed: Math.floor(this.state.speed * 0.9),
    });
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
    if (this.state.finished) {
      return;
    }

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
          speed: this.state.speed > MAX_SPEED ? parseInt(this.state.speed * 0.99, 10) : MAX_SPEED,
        },
        this.nextTurn
      );
    }, this.state.speed);
  }

  handleEvent(evt, data) {
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
    let notifications = this.state.notifications;
    let killer = players[data.killer];
    let killed = _.map(data.killed, (index) => {
      killsStack.push(data.killer);
      killer.kills++;
      players[index].deaths++;
      return players[index];
    });

    this.pushNotification({
      text: `${killer.getName()} eliminated ${_.map(killed, (player) => player.getName()).join(
        ","
      )}`,
    });

    setTimeout(() => this.handleStreak(data.killer, killer, killed), 100);
  }

  endGame() {
    const winner =
      _.sortBy(this.state.clashjs.gameStats, (playerStats) => playerStats.wins * -1)[0] || {};

    this.pushNotification({
      expire: Infinity,
      text: <b style={{ color: "#2ecc71", fontWeight: 600 }}>Congratulations {winner.name}!</b>,
    });

    this.pushNotification({ expire: Infinity, text: "Refresh the page to start again" });

    this.setState({
      // clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: 0,
      // notifications: [],
      finished: true,
    });
  }

  pushNotification({ text, expire }) {
    this.setState((state) => {
      return {
        notifications: [
          ...state.notifications,
          {
            expire: expire || new Date().getTime() + 6 * 1000,
            date: new Date().getTime(),
            text: text,
            id: state.notifications.length,
          },
        ],
      };
    });
  }

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length;
    let multiKill = "";
    let spreeMessage = "";
    let notifications = this.state.notifications;

    switch (killed.length) {
      case 2:
        multiKill = killer.getName() + " got a double kill!";
        break;
      case 3:
        multiKill = killer.getName() + " got a Triple Kill!";
        break;
      case 4:
        multiKill = killer.getName() + " is a MONSTER KILLER!";
        break;
    }

    if (multiKill) {
      this.pushNotification({
        text: multiKill,
      });
    }

    switch (streakCount + Math.floor(Math.random() * 3)) {
      case 3:
        spreeMessage = killer.getName() + " is on a elimination spree!";
        break;
      case 4:
        spreeMessage = killer.getName() + " is dominating!";
        break;
      case 5:
        spreeMessage = killer.getName() + " is on a rampage of eliminations!";
        break;
      case 6:
        spreeMessage = killer.getName() + " is Godlike!";
        break;
      default:
        spreeMessage = `Somebody please stop ${killer.getName()}!`;
    }

    if (Math.random() > 0.5 && spreeMessage) {
      this.pushNotification({ text: spreeMessage });
    }
  }

  render() {
    const { clashjs, shoots, finished, speed, notifications } = this.state;

    const { gameStats, playerStates, playerInstances, rounds, totalRounds } = clashjs;

    const gameEnvironment = clashjs.gameEnvironment;

    _.forEach(playerInstances, (player, index) => {
      gameStats[player.getId()].isAlive = playerStates[index].isAlive;
    });

    return (
      <div className="clash" onClick={this.handleClick.bind(this)}>
        <Tiles gridSize={gameEnvironment.gridSize} />
        <Shoots shoots={shoots.slice()} gridSize={gameEnvironment.gridSize} />
        <Ammos gridSize={gameEnvironment.gridSize} ammoPosition={gameEnvironment.ammoPosition} />
        <Players
          speed={speed}
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates}
        />
        {notifications.length && <Notifications notifications={notifications} />}
        <Stats rounds={rounds} total={totalRounds} playerStates={playerStates} stats={gameStats} />
        {true && <pre className="debugger">{JSON.stringify(playerStates, 0, 2)}</pre>}
      </div>
    );
  }
}

export default Clash;
