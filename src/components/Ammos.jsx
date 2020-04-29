import React from "react";
import PropTypes from 'prop-types'
import _ from "lodash";

class Ammos extends React.Component {
  render() {
    var { gridSize, ammoPosition } = this.props;

    var tileSize = 100 / gridSize;

    var ammoRender = _.map(ammoPosition, (ammoPos, ammoIndex) => {
      return (
        <div
          key={ammoIndex}
          className="clash-ammo"
          style={{
            top: tileSize * ammoPos[0] + "vmin",
            left: tileSize * ammoPos[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin"
          }}
        />
      );
    });

    return (
     <div className="clash-layer animation-glow">{ammoRender}</div>
);
  }
}
Ammos.propTypes = {
  gridSize: PropTypes.number.isRequired,
  ammoPosition: PropTypes.array
};

export default Ammos;
