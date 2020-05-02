import React from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import styled from 'styled-components'

const CustomLabels = styled.div`
.rangeslider__handle {
  width: 34px;
  height: 34px;
  border-radius: 30px;
  text-align: center;
  xbackground: #222;
}

.rangeslider__handle:after {
  display: none;
}

.xrangeslider__label {
  top: 18px
}

.xrangeslider__handle-tooltip {
  width: 60px;
  left: 50%;
  transform: translate3d(-50%,0,0)
}

.rangeslider__handle-label {
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%,-50%,0)
}

`


export default function RangeSlider({ speed, handleChangeSpeed }) {
  const [value, setValue] = React.useState(speed)
  function updateSpeed(newSpeed) {
    setValue(newSpeed)
    // handleChangeSpeed(newSpeed)
  }
  const horizontalLabels = {
    0: 'Fast',
    // 200: 'Medium',
    1000: 'Slow'
  }

  return (
    <CustomLabels>
      <Slider
        min={0}
        max={1000}
        value={value}
        labels={horizontalLabels}
        format={value => value}
        handleLabel={String(value)}
        onChange={updateSpeed}
        onChangeComplete={() => handleChangeSpeed(value)}
      />
    </CustomLabels>
  )
}
