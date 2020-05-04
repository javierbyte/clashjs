import React from "react";
import { sample, range } from 'lodash'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faTable,
  faMusic,
  faColumns,
  faChartLine,
  faChartBar,
  faChartArea,
  faClipboard,
  faClipboardList,
  faPoll,
  faRocket,
  faMeteor,
  faBan,
  faGem,
} from "@fortawesome/free-solid-svg-icons";
import { Grid, Cell } from 'styled-css-grid'
import styled from 'styled-components'
import Modal from './Modal'
import Slider from "./Slider";

const Title = styled.header`
  text-align: center;
  margin-top: -1.5em;
`

const Card = styled.div`
  padding: 4px;
`
const Image = styled.img`
  display: block;
  margin: auto;
  max-width: 15vmin;
  max-height: 15vmin;
  width: auto;
  height: auto;
`

const Caption = styled.div`
  padding: 10px 0 2px 0;
  text-align: center;
`

const statsIcon = sample([faTable, faColumns, faChartLine, faChartBar, faChartArea, faPoll, faClipboard, faClipboardList])

export default function ControlPanel({
  running,
  sounds,
  music,
  speed,
  asteroids,
  cargo,
  handleToggleRunning,
  handleToggleSounds,
  handleToggleMusic,
  handleToggleStats,
  handleChangeSpeed,
  handleToggleAsteroids,
  handleToggleCargo,
}) {
  const [showRockets, setShowRockets] = React.useState(false)
  const columns = window.innerWidth > 900 ? 10 : 5
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
      <button
        className="circle-button"
        onClick={handleToggleMusic}
      >
        {music ? (
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faMusic} transform="up-6 left-2 shrink-1" />
            <FontAwesomeIcon icon={faVolumeUp} transform="down-8 shrink-4" />
          </span>
        ) : (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faMusic} transform="up-6 left-2 shrink-1" />
              <FontAwesomeIcon icon={faVolumeMute} transform="down-8 shrink-4" />
            </span>
          )}
      </button>
      <button
        className="circle-button"
        onClick={handleToggleAsteroids}
      >
        {asteroids ? (
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faMeteor} transform="" />
          </span>
        ) : (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faMeteor} transform="" />
              <FontAwesomeIcon icon={faBan} transform="grow-12" />
            </span>
          )}
      </button>
      <button
        className="circle-button"
        onClick={handleToggleCargo}
      >
        {cargo ? (
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faGem} transform="" />
          </span>
        ) : (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon={faGem} transform="" />
              <FontAwesomeIcon icon={faBan} transform="grow-12" />
            </span>
          )}
      </button>
      <br />
      <Slider speed={speed} handleChangeSpeed={handleChangeSpeed} />
      <br />
      <button className="circle-button" onClick={handleToggleStats}>
        <FontAwesomeIcon icon={statsIcon} />
      </button>
      <button className="circle-button" onClick={() => setShowRockets(true)}>
        <FontAwesomeIcon icon={faRocket} />
      </button>
      <Modal
        open={showRockets}
        onClose={() => setShowRockets(false)}
        modalStyle='dark-modal'
      >
        <Title><h2>Rocket Styles</h2></Title>
        <Grid columns={columns}>
          {range(111).map(i => {
            return <Cell width={1} center key={i}>

              <Card>
                <Caption>{`${i}`}</Caption>
                <Image src={`${process.env.PUBLIC_URL}/static/rockets/rocket${i}.png`} alt={`rocket${i}`} />
              </Card>
            </Cell>
          })}
        </Grid>
      </Modal>
    </div >
  );
}
