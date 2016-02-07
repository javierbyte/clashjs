var React = require('react/addons')
var Notifications = React.createClass({

  propTypes: {
    kills: React.PropTypes.array
  },

  render() {
    var {kills} = this.props;
    var date = new Date();

    _.remove(kills, (k) => (date - k.date) > 3000);
    kills = _.sortBy(kills, (k) => k.date.valueOf);
    return (
      <div className='notifications'>
        {
          _.map(kills, (k, idx) => {
            return (<p key={idx}>{k.text}</p>);
          })
        }
      </div>
    );
  }

});

module.exports = Notifications;
