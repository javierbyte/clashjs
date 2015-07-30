var React = require('react');
var _ = require('lodash');

var Tiles = require('./Tiles.jsx');
var Ammos = require('./Ammos.jsx');
var Players = require('./Players.jsx');
var Stats = require('./Stats.jsx');
var Shoots = require('./Shoots.jsx');

var deepSetState = require('../mixins/deepSetState.js');

var ClashJS = require('../clashjs/ClashCore.js');

var playerObjects = require('../Players.js');
var playerArray = _.shuffle(_.map(playerObjects, el => el));

const shootLifeSpan = 10 * 1000;

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS(playerArray, this.handleEvent);
    return {
      clashjs: this.ClashJS.getState(),
      shoots: [],
      speed: 200
    };
  },

  componentDidMount() {
    this.nextTurn();
  },

  nextTurn() {
    window.setTimeout(() => {
      this.setState({
        clashjs: this.ClashJS.nextPly(),
        speed: this.state.speed > 50 ? this.state.speed - 1 : 50
      }, this.nextTurn);
    }, this.state.speed);
  },

  handleEvent(evt, data) {
    console.warn(evt, data, this.state.shoots);

    if (evt === 'SHOOT') {
      let currentTime = new Date().getTime();
      let newShoots = this.state.shoots.slice();

      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime()
      });

      this.setState({
        shoots: newShoots.filter((el) => {
          return el.time + shootLifeSpan > currentTime;
        })
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
    var {clashjs, shoots} = this.state;
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

        <Stats
          playerInstances={playerInstances}
          playerStates={playerStates} />

      </div>
    );
  }

});

module.exports = Clash;
