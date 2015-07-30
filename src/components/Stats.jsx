var React = require('react');
var _ = require('lodash');

var Stats = React.createClass({

  propTypes: {
    playerInstances: React.PropTypes.array.isRequired,
    playerStates: React.PropTypes.array.isRequired,
    winners: React.PropTypes.array.isRequired
  },

  render() {
    var {playerInstances, playerStates, winners} = this.props;

    return (
      <div className='stats'>
        {_.map(playerInstances, (el, index) => {
          var playerInfo = el.getInfo();
          var playerState = playerStates[index];

          return (
            <div key={index} style={{
              textDecoration: playerState.isAlive ? 'none' : 'line-through',
              color: playerState.isAlive ? '#FFF' : '#A00'
            }}>
              {playerInfo.name}
              {' '}
              <b>{winners[index]}</b>
            </div>
          );
        })}
      </div>
    );
  }

});

module.exports = Stats;
