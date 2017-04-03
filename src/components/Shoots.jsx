var React = require('react');

var DIRECTIONS = ['north', 'east', 'south', 'west'];

var _ = require('lodash');

var Shoots = React.createClass({
  propTypes: {
    gridSize: React.PropTypes.number.isRequired,
    shoots: React.PropTypes.array
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.shoots.length !== this.props.shoots.length;
  },

  render() {
    var { shoots, gridSize } = this.props;

    var tileSize = 100 / gridSize;

    var shootsRender = _.map(shoots, (el, index) => {
      return (
        <div
          key={index}
          className="clash-shoot animation-shot"
          style={{
            top: tileSize * el.origin[0] + 'vmin',
            left: tileSize * el.origin[1] + 'vmin',
            transform: 'translatex(' +
              tileSize / 2 +
              'vmin) ' +
              'translatey(' +
              tileSize / 2 +
              'vmin) ' +
              'rotate(' +
              (DIRECTIONS.indexOf(el.direction) - 1) * 90 +
              'deg) '
          }}
        />
      );
    });

    return (
      <div className="clash-layer">
        {shootsRender}
      </div>
    );
  }
});

module.exports = Shoots;
