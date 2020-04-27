import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

export default function ControlPanel({
  running,
  sounds,
  handleToggleRunning,
  handleToggleSounds,
}) {
  return (
    <div className="control-panel">
      <button className="circle-button" onClick={handleToggleRunning}>
        {running ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button className="circle-button" onClick={handleToggleSounds}>
        {sounds ? (
          <FontAwesomeIcon icon={faVolumeUp} />
        ) : (
          <FontAwesomeIcon icon={faVolumeMute} />
        )}
      </button>
    </div>
  );
}
