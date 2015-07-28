var React = require('react');
var _ = require('lodash');

var Tiles = require('./Tiles.jsx');
var Ammos = require('./Ammos.jsx');
var Players = require('./Players.jsx');
var Stats = require('./Stats.jsx');

var deepSetState = require('../mixins/deepSetState.js');

var ClashJS = require('../clashjs/ClashCore.js');

var playerObjects = require('../Players.js');
var playerArray = _.map(playerObjects, el => el);

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS(playerArray);
    return this.ClashJS.getState();
  },

  componentDidMount() {
    window.setInterval(() => {
      this.replaceState(this.ClashJS.nextPly());
    }, 100);
  },

  nextStep() {
    this.replaceState(this.ClashJS.nextStep());
  },

  render() {
    var {gameEnvironment, playerStates, playerInstances} = this.state;

    return (
      <div className='clash' onClick={this.nextStep}>
        <Tiles
          gridSize={gameEnvironment.gridSize} />
        <Players
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition} />

        <Stats
          playerInstances={playerInstances}
          playerStates={playerStates} />
      </div>
    );
  }

});

module.exports = Clash;
