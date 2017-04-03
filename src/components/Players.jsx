var React = require('react');
var _ = require('lodash');

var DIRECTIONS = ['north', 'east', 'south', 'west'];

var Players = React.createClass({
  propTypes: {
    gridSize: React.PropTypes.number.isRequired,
    playerStates: React.PropTypes.array,
    playerInstances: React.PropTypes.array
  },

  getInitialState() {
    var { playerStates } = this.props;

    return {
      playerDirections: playerStates.map(el => DIRECTIONS.indexOf(el.direction))
    };
  },

  componentWillReceiveProps(nextProps) {
    var playerDirections = this.state.playerDirections;
    var newPlayerDirections = nextProps.playerStates.map(el => DIRECTIONS.indexOf(el.direction));

    this.setState({
      playerDirections: newPlayerDirections.map((el, index) => {
        var diff = (el + 4) % 4 - (playerDirections[index] + 4) % 4;
        if (diff === 3) diff = -1;
        if (diff === -3) diff = 1;

        return playerDirections[index] + diff;
      })
    });
  },

  render() {
    var { playerDirections } = this.state;
    var { gridSize, playerStates, playerInstances } = this.props;

    var tileSize = 100 / gridSize;

    var playerRender = _.map(playerStates, (playerData, playerIndex) => {
      if (!playerData.isAlive) return null;

      var playerInfo = playerInstances[playerIndex].getInfo();

      return (
        <div
          key={playerIndex}
          className="clash-player-container"
          style={{
            width: tileSize + 'vmin',
            height: tileSize + 'vmin',
            transform: 'translateY(' +
              tileSize * playerData.position[0] +
              'vmin) ' +
              'translateX(' +
              tileSize * playerData.position[1] +
              'vmin)'
          }}
        >
          <div
            className="clash-player"
            style={{
              width: tileSize + 'vmin',
              height: tileSize + 'vmin',
              backgroundImage: 'url(static/rockets/rocket' + (playerData.style || 0) + '.png)',
              transform: 'scale(1.25) ' + 'rotate(' + 90 * playerDirections[playerIndex] + 'deg) '
            }}
          />
          <div className="clash-player-name">
            {playerInfo.name}
          </div>
        </div>
      );
    });

    return (
      <div className="clash-layer">
        {playerRender}
      </div>
    );
  }
});

module.exports = Players;
