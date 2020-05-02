import React from "react";
import PropTypes from 'prop-types'
import _ from "lodash";

class Asteroids extends React.Component {
  render() {
    var { gridSize, asteroids } = this.props;

    var tileSize = 100 / gridSize;

    var astroidRenderer = _.map(asteroids, (asteroid, index) => {
      return (
        <div
          key={index}
          className={`clash-asteroid-${asteroid.style}`}
          style={{
            top: tileSize * asteroid.position[0] + "vmin",
            left: tileSize * asteroid.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin"
          }}
        />
      );
    });

    return (
     <div className="clash-layer animation-glow">{astroidRenderer}</div>
);
  }
}
Asteroids.propTypes = {
  gridSize: PropTypes.number.isRequired,
  asteroids: PropTypes.array
};

export default Asteroids;
