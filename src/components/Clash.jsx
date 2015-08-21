var React = require('react');
var _ = require('lodash');
var fx = require('./../lib/sound-effects');
var Tiles = require('./Tiles.jsx');
var Ammos = require('./Ammos.jsx');
var Players = require('./Players.jsx');
var Stats = require('./Stats.jsx');
var Shoots = require('./Shoots.jsx');
var Notifications = require('./Notifications.jsx');

var deepSetState = require('../mixins/deepSetState.js');

var ClashJS = require('../clashjs/ClashCore.js');

var playerObjects = require('../Players.js');
var playerArray = _.shuffle(_.map(playerObjects, el => el));

var sudeenDeathCount = 0;
var killsStack = [];

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS(playerArray, {}, this.handleEvent);
    return {
      clashjs: this.ClashJS.getState(),
      shoots: [],
      speed: 100,
      winners: playerArray.map(() => 0),
      rates: playerArray.map(() => 0),
      kills: []
    };
  },

  componentDidMount() {
    this.nextTurn();
  },

  newGame() {
    killsStack = [];
    let stats = this.ClashJS._gameStats;
    this.ClashJS.getState().playerStates.forEach((player, index) => {
      if (player.isAlive) {
        let newWinners = this.state.winners;
        let newRates = this.state.rates;
        let total = 0;

        newWinners[index]++;

        total = _.reduce(newWinners, (tot, n) => tot + n);

        newRates = _.map(newWinners, (wins, index) => {
          if (!wins) return 0;
          if (!total) return 0;
          return wins / total;
        });

        this.setState({
          winners: newWinners,
          rates: newRates
        });
      }
    });

    window.setTimeout(() => {
      sudeenDeathCount = 0;
      this.ClashJS.setupGame();
      this.setState({
        clashjs: this.ClashJS.getState(),
        shoots: [],
        speed: 100,
        kills: []
      }, this.nextTurn);
    }, 1000);
  },

  nextTurn() {
    var {playerStates, rounds, totalRounds} = this.ClashJS.getState();
    var alivePlayerCount = playerStates.reduce((result, el) => {
      return el.isAlive ? (result + 1) : result;
    }, 0);

    if (alivePlayerCount < 3) {
      sudeenDeathCount++;
      if (sudeenDeathCount > 500) {
        console.error('You guys are just dancing, 500 turns with no winner, call this one a draw.');
        playerStates.forEach((el) => el.isAlive = false);
        if (rounds < totalRounds) {
          return this.newGame();
        }
      }
    }

    if (alivePlayerCount < 2 && rounds < totalRounds) return this.newGame();
    window.setTimeout(() => {
      this.setState({
        clashjs: this.ClashJS.nextPly(),
        speed: this.state.speed > 15 ? parseInt(this.state.speed * 0.98, 10) : 15
      }, this.nextTurn);
    }, this.state.speed);
  },

  handleEvent(evt, data) {
    if (evt === 'SHOOT') {
      let newShoots = this.state.shoots;
      let players = this.ClashJS.getState().playerInstances;
      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime()
      });

      this.setState({
        shoots: newShoots
      });

      players[data.shooter].playLaser();
    }

    if (evt === 'KILL') this._handleKill(data);
  },

  handleClick() {
    this.setState({
      clashjs: this.ClashJS.nextStep(),
      speed: Math.max(parseInt(this.state.speed * 0.75, 10), 1)
    });
  },

  _handleKill(data) {
    let players = this.ClashJS.getState().playerInstances;
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
      'killed',
      _.map(killed, (player) => player.getName()).join(',')
    ].join(' ');

    kills.push({date: new Date, text: notification});
    this.setState({
      kills: kills
    });

    setTimeout(()=> this.handleStreak(data.killer, killer, killed), 100);

  },

  handleStreak(index, killer, killed) {
    let streakCount = _.filter(killsStack, (player) => player === index).length;
    let multiKill = '';
    let spreeMessage = '';
    let kills = this.state.kills;
    if (killsStack.length === 1) {
      setTimeout(fx.streak.firstBlood.play(), 50);
    }

    switch (killed.length) {
      case 2:
        setTimeout(fx.streak.doubleKill.play(), 100);
        multiKill = killer.getName() + ' got a double kill!';
        break;
      case 3:
        setTimeout(fx.streak.tripleKill.play(), 100);
        multiKill = killer.getName() + ' got a Triple Kill!';
        break;
      case 4:
        setTimeout(fx.streak.monsterKill.play(), 100);
        multiKill = killer.getName() + ' is a MONSTER KILLER!';
        break;
    }
    kills.push({date: new Date, text: multiKill});
    switch(streakCount) {
      case 1:
      case 2:
        break;
      case 3:
        setTimeout(fx.streak.killingSpree.play(), 300);
        spreeMessage = killer.getName() + ' is on a killing spree!';
        break;
      case 4:
        setTimeout(fx.streak.dominating.play(), 300);
        spreeMessage = killer.getName() + ' is dominating!';
        break;
      case 5:
        setTimeout(fx.streak.rampage.play(), 300);
        spreeMessage = killer.getName() + ' is on a rampage of kills!';
        break;
      case 6:
        setTimeout(fx.streak.godLike.play(), 300);
        spreeMessage = killer.getName() + ' is Godlike!';
        break;
      default:
        spreeMessage = 'Somebody stop that bastard ' + killer.getName();
        setTimeout(fx.streak.ownage.play(), 300);
    }
    kills.push({date: new Date, text: spreeMessage});
    this.setState({
      kills: kills
    });
  },

  render() {
    var {clashjs, shoots, winners, rates, kills} = this.state;
    var {gameEnvironment, gameStats, playerStates, playerInstances, rounds, totalRounds} = clashjs;
    _.forEach(playerInstances, function(player, index) {
      gameStats[player.getId()].isAlive = playerStates[index].isAlive;
    });
    return (
      <div className='clash' onClick={this.handleClick}>
        <Tiles
          gridSize={gameEnvironment.gridSize} />
        <Shoots
          shoots={shoots.slice()}
          gridSize={gameEnvironment.gridSize} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition} />
        <Players
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates} />
        <Notifications
          kills={kills} />
        <Stats
          rounds={rounds}
          total={totalRounds}
          playerStates={playerStates}
          stats={gameStats} />
      </div>
    );
  }

});

module.exports = Clash;
