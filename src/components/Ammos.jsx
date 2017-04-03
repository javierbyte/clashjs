var React = require('react');
var _ = require('lodash');

var Ammos = React.createClass({
  propTypes: {
    gridSize: React.PropTypes.number.isRequired,
    ammoPosition: React.PropTypes.array
  },

  render() {
    var { gridSize, ammoPosition } = this.props;

    var tileSize = 100 / gridSize;

    var ammoRender = _.map(ammoPosition, (ammoPos, ammoIndex) => {
      return (
        <div
          key={ammoIndex}
          className="clash-ammo"
          style={{
            top: tileSize * ammoPos[0] + 'vmin',
            left: tileSize * ammoPos[1] + 'vmin',
            width: tileSize + 'vmin',
            height: tileSize + 'vmin'
          }}
        />
      );
    });

    return (
      <div className="clash-layer animation-glow">
        {ammoRender}
      </div>
    );
  }
});

module.exports = Ammos;
