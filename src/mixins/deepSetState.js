var _ = require('lodash');

module.exports = {
  deepSetState(value, callback) {
    this.state = _.merge(this.state, value, value);
    this.forceUpdate();
    if (callback) callback(this.state);
  }
};
