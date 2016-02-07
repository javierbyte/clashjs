var React = require('react');
var _ = require('lodash');

var Stats = React.createClass({

  propTypes: {
    stats: React.PropTypes.object.isRequired,
    rounds: React.PropTypes.number.isRequired,
    total: React.PropTypes.number.isRequired
  },

  render() {
    let {stats, rounds, total} = this.props;
    stats = _.map(stats, (playerStats) => playerStats);
    stats = _.sortBy(stats, (playerStats) => playerStats.wins * -1);
    return (
      <div className='stats'>
        <div className="stats-title">Round {rounds} of {total}</div>
        <table>
          <thead>
            <td></td>
            <td></td>
            <td>Wins</td>
          </thead>
          <tbody>
          {_.map(stats, (playerStats, index) => {
            return (
              <tr key={index} className={playerStats.isAlive ? '' : 'player-dead'}>
                <td>{playerStats.isAlive ? '' : "💀"}</td>
                <td className='player-name'>{playerStats.name}</td>
                <td className='stats-results'>{playerStats.wins}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }

});

module.exports = Stats;
