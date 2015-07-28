var React = require('react');
var _ = require('lodash');

var DIRECTIONS = ['north', 'east', 'south', 'west'];

var Ammos = React.createClass({

  propTypes: {
    gridSize: React.PropTypes.number.isRequired,
    players: React.PropTypes.array
  },

  getInitialState() {
    var {players} = this.props;

    return {
      playerDirections: players.map(el => DIRECTIONS.indexOf(el.direction))
    };
  },

  componentWillReceiveProps(nextProps) {
    var playerDirections = this.state.playerDirections;
    var newPlayerDirections = nextProps.players.map(el => DIRECTIONS.indexOf(el.direction));

    this.setState({
      playerDirections: newPlayerDirections.map((el, index) => {
        var diff = ((el + 4) % 4) - ((playerDirections[index] + 4) % 4);
        console.warn(diff);
        if (diff === 3) diff = -1;
        if (diff === -3) diff = 1;

        return playerDirections[index] + diff;
      })
    });
  },

  render() {
    var {playerDirections} = this.state;
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
            'rotate(' + (90 * playerDirections[playerIndex]) + 'deg) '
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
