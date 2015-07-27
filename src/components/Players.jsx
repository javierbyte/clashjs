var React = require('react');
var _ = require('lodash');

var Ammos = React.createClass({

  propTypes: {
    gridSize: React.PropTypes.number.isRequired,
    players: React.PropTypes.array
  },

  render() {
    var {gridSize, players} = this.props;

    var tileSize = 100 / gridSize;

    var ammoRender = _.map(players, (playerData, playerIndex) => {
      return (
        <div key={playerIndex} className='clash-player' style={{
          WebkitMaskImage: 'url(/static/rockets/rocket' + (playerData.style || 0) + '.png)',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          backgroundColor: playerData.color || '#FFF',
          top: (tileSize * playerData.position[0]) + 'vmin',
          left: (tileSize * playerData.position[1]) + 'vmin',
          width: tileSize + 'vmin',
          height: tileSize + 'vmin',
          transform: 'scale(1.25) rotate(' + (90 * playerData.direction) + 'deg)'
        }} />
      );
    });

    return (
      <div className='clash-layer'>
        {ammoRender}
      </div>
    );
  }

});

module.exports = Ammos;
