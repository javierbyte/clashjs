import React from "react";
import _ from "lodash";
import { Grid, Cell } from "styled-css-grid";
import { enableSounds, disableSounds, playSound, startMusic, stopMusic, streaks } from "./../lib/sound-effects";
import Tiles from "./Tiles.jsx";
import Ammos from "./Ammos.jsx";
import Cargo from "./Cargo.jsx";
import Asteroids from "./Asteroids.jsx";
import Players from "./Players.jsx";
import Stats from "./Stats.jsx";
import Shoots from "./Shoots.jsx";
import Notifications from "./Notifications.jsx";
import ControlPanel from "./ControlPanel.jsx";
import DebugPanel from "./DebugPanel.jsx";
import StatsModal from './StatsModal'

import ClashJS from "../clashjs/ClashCore.js";

import playerObjects from "../Players.js";
var playerArray = _.shuffle(_.map(playerObjects, (el) => el.default ? el.default : el));

var killsStack = [];

const DEFAULT_SPEED = 200;
const MAX_SPEED = 50;

class Clash extends React.Component {
  constructor(props) {
    super(props);

    window.ClashInstance = new ClashJS(
      playerArray,
      {},
      this.handleEvent.bind(this),
    );

    // window.ClashInstance.target.addEventListener("DATA", evt => {
    //   this.handleEvent(evt.detail.name, evt.detail.data);
    // });

    this.state = {
      running: false,
      showDebug: false,
      sounds: true,
      music: false,
      asteroidsOn: true,
      cargoOn: true,
      clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: DEFAULT_SPEED,
      notifications: [],
      currentGameIndex: 1,
      finished: false,
      showStats: false,
    };
    this.state.sounds ? enableSounds() : disableSounds()
  }

  componentDidMount() {
    window.addEventListener("keydown", (evt) => {
      // console.log('keydown', evt.code, evt.key)
      if (evt.key === "d") {
        this.setState((prevState) => ({
          showDebug: !prevState.showDebug,
        }));
      }
      if (evt.code === "Space") {
        this.handleToggleRunning()
      }
      if (evt.code === "KeyS") {
        this.handleToggleSounds()
      }
      if (evt.code === "KeyM") {
        this.handleToggleMusic()
      }
    });
  }

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
        if (this.state.sounds) {
          enableSounds()
          startMusic()
        } else {
          disableSounds()
          stopMusic()
        }
      }
    );
  }

  handleToggleMusic() {
    // console.log('toggle music', this.state.music)
    this.setState(
      (prevState) => ({
        music: !prevState.music,
      }),
      () => {
        if (this.state.music) {
          //  enableSounds()
          startMusic()
        } else {
          //  disableSounds()
          stopMusic()
        }
      }
    );
  }

  handleToggleStats() {
    this.setState(
      (prevState) => ({
        showStats: !prevState.showStats,
      })
    );
  }

  handleToggleAsteroids() {
    this.setState(
      (prevState) => {
        const newValue = !prevState.asteroidsOn
        window.ClashInstance.setAsteroidsOn(newValue)
        return {
          asteroidsOn: newValue,
        }
      }
    );
  }

  handleToggleCargo() {
    this.setState(
      (prevState) => {
        const newValue = !prevState.cargoOn
        window.ClashInstance.setCargoOn(newValue)
        if (newValue) {
          return {
            cargoOn: newValue,
          }
        } else {
          return {
            cargoOn: newValue,
            cargos: []
          }
        }
      }
    );
  }

  handleChangeSpeed(newSpeed) {
    // console.log('handleChangeSpeed', newSpeed)
    this.setState({
      speed: newSpeed
    })
  }

  newGame() {
    killsStack = [];

    if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout);

    window.ClashInstance.setupGame();
    // console.log('newGame setState')
    this.setState(
      (state) => {
        // console.log('newGame setState state', state)
        return {
          clashjs: window.ClashInstance.getState(),
          speed: DEFAULT_SPEED,
          notifications: state.notifications.concat({ date: new Date(), text: '~~~ New Game ~~~' }),
          currentGameIndex: state.currentGameIndex + 1,
        };
      },
      () => {
        // console.log('newGame setState callback', this.nextTurnTimeout, this.state.clashjs)
        if (this.nextTurnTimeout) clearTimeout(this.nextTurnTimeout);
        this.nextTurnTimeout = window.setTimeout(() => {
          this.nextTurn();
        }, 3000);
      }
    );
  }

  nextTurn() {
    // console.log('nextTurn', this.state)
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
    if (evt === "WIN") {
      this.setState(state => ({
        notifications: state.notifications.concat({ date: new Date(), text: 'WINNER!' })
      }))
      return this.newGame()
    }
    if (evt === "DRAW") {
      this.setState(state => ({
        notifications: state.notifications.concat({ date: new Date(), text: 'Stalemate' })
      }))
      return this.newGame()
    }
    if (evt === "KILL") return this._handleKill(data);
    if (evt === "DESTROY") return this._handleDestroy(data);
    if (evt === "END") return this.endGame();
  }

  _handleDestroy({ player }) {
    console.log("*** handleDestroy", player);
    let notification = ["An Asteroid", "destroyed", player.name].join(" ");

    const { notifications } = this.state;
    notifications.push({ date: new Date(), text: notification });
    this.setState({
      notifications,
    });
  }

  _handleKill(data) {
    let players = window.ClashInstance.getState().playerInstances;
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

    this.setState(state => ({
      notifications: state.notifications.concat({ date: new Date(), text: notification })
    }));

    setImmediate(() => this.handleStreak(data.killer, killer, killed));
  }

  endGame() {
    this.setState({
      clashjs: window.ClashInstance.getState(),
      shoots: [],
      speed: 0,
      // notifications: [],
      finished: true,
      showStats: true,
    });
  }

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length;
    let multiKill = "";
    let spreeMessage = "";
    const { notifications } = this.state;
    if (killsStack.length === 1) {
      setTimeout(() => playSound(streaks.firstBlood), 150);
    }

    switch (killed.length) {
      case 2:
        setTimeout(() => playSound(streaks.doubleKill), 200);
        multiKill = killer.getName() + " got a double kill!";
        break;
      case 3:
        setTimeout(() => playSound(streaks.tripleKill), 200);
        multiKill = killer.getName() + " got a Triple Kill!";
        break;
      case 4:
        setTimeout(() => playSound(streaks.monsterKill), 200);
        multiKill = killer.getName() + " is a MONSTER KILLER!";
        break;
      default:
        break;
    }
    notifications.push({
      date: new Date(),
      text: multiKill,
    });
    if (streakCount > 1) {
      const currentStreak = this.state.clashjs.gameStats[killer.getId()].killStreak
      // console.log('killstreak', streakCount, currentStreak, Math.max(streakCount, currentStreak || 0), killsStack)
      window.ClashInstance._gameStats[killer.getId()].killStreak = Math.max(streakCount, currentStreak || 0)
    }
    switch (streakCount) {
      case 2:
        setTimeout(() => playSound(streaks.killingSpree), 400);
        spreeMessage = killer.getName() + " is on a killing spree!";
        break;
      case 3:
        setTimeout(() => playSound(streaks.dominating), 400);
        spreeMessage = killer.getName() + " is dominating!";
        break;
      case 4:
        setTimeout(() => playSound(streaks.rampage), 400);
        spreeMessage = killer.getName() + " is on a rampage of kills!";
        break;
      default:
        setTimeout(() => playSound(streaks.ownage), 400);
        spreeMessage = `Can anyone stop ${killer.getName()}?!?`;
    }
    notifications.push({ date: new Date(), text: spreeMessage })
    this.setState({
      notifications
    });
  }

  render() {
    var {
      clashjs,
      shoots,
      notifications,
      finished,
      running,
      sounds,
      music,
      asteroidsOn,
      cargoOn,
      showDebug,
      showStats,
      speed,
    } = this.state;
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

    if (finished) {
      // console.trace('finished')
      const winner = _.sortBy(
        gameStats,
        (playerStats) => playerStats.wins * -1
      )[0];
      notifications.push({
        date: new Date(),
        text: (
          <b style={{ color: "#0e0", fontWeight: 700 }}>
            Congrats {winner.name}!
          </b>
        ),
      });
      notifications.push({
        date: new Date(),
        text: "Refresh the page to start again",
      });
    }

    return (
      <>
        <Grid
          columns="1fr 100vmin 1fr"
          areas={[
            "control game stats",
            "debug   game notifications",
          ]}>
          <Cell area="game" onClick={this.handleClick.bind(this)}>
            <div className="clash">
              <Tiles gridSize={gameEnvironment.gridSize} />
              <Shoots shoots={shoots.slice()} gridSize={gameEnvironment.gridSize} />
              <Ammos
                gridSize={gameEnvironment.gridSize}
                ammoPosition={gameEnvironment.ammoPosition}
              />
              <Cargo
                gridSize={gameEnvironment.gridSize}
                cargos={gameEnvironment.cargos}
              />
              <Players
                gridSize={gameEnvironment.gridSize}
                playerInstances={playerInstances}
                playerStates={playerStates}
                debug={showDebug}
              />
              <Asteroids
                gridSize={gameEnvironment.gridSize}
                asteroids={gameEnvironment.asteroids}
              />
            </div>
          </Cell>
          <Cell area="control">
            <ControlPanel
              running={running}
              sounds={sounds}
              music={music}
              stats={showStats}
              speed={speed}
              asteroids={asteroidsOn}
              cargo={cargoOn}
              handleToggleRunning={this.handleToggleRunning.bind(this)}
              handleToggleSounds={this.handleToggleSounds.bind(this)}
              handleToggleMusic={this.handleToggleMusic.bind(this)}
              handleToggleStats={this.handleToggleStats.bind(this)}
              handleChangeSpeed={this.handleChangeSpeed.bind(this)}
              handleToggleAsteroids={this.handleToggleAsteroids.bind(this)}
              handleToggleCargo={this.handleToggleCargo.bind(this)}
            />
          </Cell>
          <Cell area="debug">{showDebug && <DebugPanel playerStates={playerStates} />}</Cell>
          <Cell area="stats">
            <Stats
              rounds={rounds}
              total={totalRounds}
              playerStates={playerStates}
              stats={gameStats}
            />
          </Cell>
          <Cell area="notifications"><Notifications messages={notifications} /></Cell>
        </Grid>
        <StatsModal open={showStats} onClose={() => this.setState({ showStats: false })}
          rounds={rounds}
          total={totalRounds}
          playerStates={playerStates}
          stats={gameStats} />
      </>
    );
  }
}

export default Clash;
