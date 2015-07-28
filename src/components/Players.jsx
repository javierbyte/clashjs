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

    var playerRender = _.map(players, (playerData, playerIndex) => {
      return (
        <div key={playerIndex} className='clash-player' style={{
          backgroundImage: 'url(/static/rockets/rocket' + (playerData.style || 0) + '.png)',
          width: tileSize + 'vmin',
          height: tileSize + 'vmin',
          transform:
            'translateY(' + tileSize * playerData.position[0] + 'vmin) ' +
            'translateX(' + tileSize * playerData.position[1] + 'vmin)' +
            'scale(1.25) ' +
            'rotate(' + (90 * playerData.direction) + 'deg) '
        }} />
      );
    });

    return (
      <div className='clash-layer'>
        {playerRender}
      </div>
    );
  }

});

module.exports = Ammos;
