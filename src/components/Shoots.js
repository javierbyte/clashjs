import React from "react";
import _ from "lodash";

var DIRECTIONS = ["north", "east", "south", "west"];

class Shoots extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return nextProps.shoots.length !== this.props.shoots.length;
  // }

  render() {
    var { shoots, gridSize } = this.props;

    var tileSize = 100 / gridSize;

    var shootsRender = _.map(shoots, (el, index) => {
      return (
        <div
          key={index}
          className="clash-shoot animation-shot"
          style={{
            top: tileSize * el.origin[0] + "vmin",
            left: tileSize * el.origin[1] + "vmin",
            transform:
              "translatex(" +
              tileSize / 2 +
              "vmin) " +
              "translatey(" +
              tileSize / 2 +
              "vmin) " +
              "rotate(" +
              (DIRECTIONS.indexOf(el.direction) - 1) * 90 +
              "deg) "
          }}
        />
      );
    });

    return <div className="clash-layer">{shootsRender}</div>;
  }
}

export default Shoots;
