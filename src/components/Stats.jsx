var React = require('react');
var _ = require('lodash');

var Stats = React.createClass({

  propTypes: {
    playerInstances: React.PropTypes.array.isRequired,
    playerStates: React.PropTypes.array.isRequired
  },

  render() {
    var {playerInstances, playerStates} = this.props;

    return (
      <div className='stats'>
        {_.map(playerInstances, (el, index) => {
          var playerInfo = el.getInfo();
          var playerState = playerStates[index];

          return (
            <div key={index}>
              {playerInfo.name}
              {' '}
              <b>{playerState.ammo}</b>
            </div>
          );
        })}
      </div>
    );
  }

});

module.exports = Stats;
