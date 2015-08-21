var React = require('react');
var _ = require('lodash');

var Stats = React.createClass({

  propTypes: {
    stats: React.PropTypes.object.isRequired,
    playerStates: React.PropTypes.array.isRequired
  },

  render() {
    var {stats, playerStates} = this.props;
    return (
      <div className='stats'>
        <h3>Results</h3>
        <table>
          <thead>
            <td></td>
            <td>Wins</td>
            <td>Win Rate</td>
            <td>K/D/R</td>
          </thead>
          <tbody>
          {_.map(stats, (playerStats, index) => {
            return (
              <tr key={index} style={{
                textDecoration: playerStats.isAlive ? 'none' : 'line-through',
                color: playerStats.isAlive ? '#FFF' : '#555'
              }}>
                <td>{playerStats.name}</td>
                <td className='stats-results'>{playerStats.wins}</td>
                <td className='stats-results'>{playerStats.winrate}%</td>
                <td className='stats-results'>{playerStats.kills}/{playerStats.deaths}/{playerStats.kdr.toFixed(1)}</td>
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
