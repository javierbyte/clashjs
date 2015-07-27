var React = require('react');

var Tiles = require('./Tiles.jsx');
var Ammos = require('./Ammos.jsx');
var Players = require('./Players.jsx');

var deepSetState = require('../mixins/deepSetState.js');

var ClashJS = require('../clashjs/ClashCore.js');

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS();
    return this.ClashJS.getState();
  },

  nextStep() {
    this.replaceState(this.ClashJS.nextStep());
  },

  render() {
    var {gameEnvironment, playerStates} = this.state;

    return (
      <div className='clash' onClick={this.nextStep}>
        <Tiles
          gridSize={gameEnvironment.gridSize} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition} />
        <Players
          gridSize={gameEnvironment.gridSize}
          players={playerStates} />
      </div>
    );
  }

});

module.exports = Clash;
