var React = require('react/addons');

var Notifications = React.createClass({

  propTypes: {
    kills: React.PropTypes.string
  },

  render() {
    var {kills} = this.props;

    return (
      <div className="notifications">
        {kills}
      </div>
    );
  }

});

module.exports = Notifications;
