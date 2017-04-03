var React = require('react/addons');

var Tiles = React.createClass({
  propTypes: {
    gridSize: React.PropTypes.number.isRequired
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    var { gridSize } = this.props;

    var tileSize = 100 / gridSize;
    var i;

    var tileRender = [];
    for (i = 0; i < gridSize * gridSize; i++) {
      tileRender.push(
        <div style={{ height: tileSize + 'vmin', width: tileSize + 'vmin' }} className="clash-tile" key={i} />
      );
    }

    return (
      <div>
        {tileRender}
      </div>
    );
  }
});

module.exports = Tiles;
