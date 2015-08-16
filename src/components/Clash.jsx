var React = require('react');
var _ = require('lodash');

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

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS(playerArray, this.handleEvent);
    return {
      clashjs: this.ClashJS.getState(),
      shoots: [],
      speed: 50,
      winners: playerArray.map(() => 0),
      rates: playerArray.map(() => 0),
      kills: null
    };
  },

  componentDidMount() {
    this.nextTurn();
  },

  newGame() {
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
      this.ClashJS = new ClashJS(playerArray, this.handleEvent);
      this.setState({
        clashjs: this.ClashJS.getState(),
        shoots: [],
        speed: 50,
        kills: null
      }, this.nextTurn);
    }, 1000);
  },

  nextTurn() {
    var alivePlayerCount = this.ClashJS.getState().playerStates.reduce((result, el) => {
      return el.isAlive ? (result + 1) : result;
    }, 0);

    if (alivePlayerCount < 3) {
      sudeenDeathCount++;
      if (sudeenDeathCount > 500) {
        console.error('You guys are just dancing, 500 turns with no winner, call this one a draw.');
        this.ClashJS.getState().playerStates.forEach((el) => el.isAlive = false);
        return this.newGame();
      }
    }

    if (alivePlayerCount < 2) {
      this.newGame();
      return;
    }

    window.setTimeout(() => {
      this.setState({
        clashjs: this.ClashJS.nextPly(),
        speed: this.state.speed > 15 ? parseInt(this.state.speed * 0.98, 10) : 15
      }, this.nextTurn);
    }, this.state.speed);
  },

  handleEvent(evt, data) {
    // console.warn(evt, data, this.state.shoots);

    if (evt === 'SHOOT') {
      let newShoots = this.state.shoots;

      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime()
      });

      this.setState({
        shoots: newShoots
      });
    }

    if (evt === 'KILL') {
      let players = this.ClashJS.getState().playerInstances;
      let notification = [
        players[data.killer].getName(),
        'killed',
        _.map(data.killed, (index) => players[index].getName()).join(',')
      ].join(' ')

      this.setState({
        kills: notification
      });
    }
  },

  handleClick() {
    this.setState({
      clashjs: this.ClashJS.nextStep(),
      speed: Math.max(parseInt(this.state.speed * 0.75, 10), 1)
    });
  },

  render() {
    var {clashjs, shoots, winners, rates, kills} = this.state;
    var {gameEnvironment, playerStates, playerInstances} = clashjs;

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
          kills={kills}
        />
        <Stats
          playerInstances={playerInstances}
          playerStates={playerStates}
          winners={winners}
          rates={rates} />

      </div>
    );
  }

});

module.exports = Clash;
