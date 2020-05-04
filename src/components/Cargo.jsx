import React from "react";
import PropTypes from 'prop-types'
import _ from "lodash";

const cargoImages = [
  "standard_gem.png",
  "container.png",
  "canister.png",
  "gem1.png",
  "gem2.png",
  "gem3.png",
  "gem4.png",
  "gem5.png",
  "diamond_03.png",
  "gem_01.png",
  "gem_02.png",
  "bluestone.png",
  "tealstone.png",
  "ruby.png",
  "diamond.png",
  "crystal1.png",
  "crystal2.png",
  "crystal3.png",
  "crystal.png",
  "round_gem.png",
]

class Cargo extends React.Component {
  render() {
    var { gridSize, cargos } = this.props;

    var tileSize = 100 / gridSize;

    var cargoRender = _.map(cargos, (cargo, cargoIndex) => {
      return (
        <img
          key={cargoIndex}
          className="clash-cargo"
          src={`${process.env.PUBLIC_URL}/static/cargo/${cargoImages[cargo.type]}`}
          alt={`cargo-${cargo.type}_${cargo.value}`}
          style={{
            top: tileSize * cargo.position[0] + "vmin",
            left: tileSize * cargo.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            transform: `scale(0.5)`,
          }}
        />
      );
    });

    return (
      <div className="clash-layer animation-glow">{cargoRender}</div>
    );
  }
}
Cargo.propTypes = {
  gridSize: PropTypes.number.isRequired,
  cargos: PropTypes.array
};

export default Cargo;
