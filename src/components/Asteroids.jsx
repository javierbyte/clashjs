import React from "react";
import PropTypes from 'prop-types'
import _ from "lodash";
import styled, { keyframes, css } from 'styled-components'
import Spritesheet from 'react-responsive-spritesheet';

const sprites = [
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosionframes.png`,
    widthFrame: 1024 / 8,
    heightFrame: 384 / 3,
    steps: 24,
    fps: 12,
    wrap: 8,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion.png`,
    widthFrame: 256 / 4,
    heightFrame: 256 / 4,
    steps: 16,
    fps: 11,
    wrap: 4,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion2.png`,
    widthFrame: 1000 / 10,
    heightFrame: 600 / 6,
    steps: 60,
    fps: 36,
    wrap: 10,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion3.png`,
    widthFrame: 2176 / 17,
    heightFrame: 128,
    steps: 17,
    fps: 12,
    wrap: 17,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion4.png`,
    widthFrame: 2176 / 17,
    heightFrame: 128,
    steps: 17,
    fps: 12,
    wrap: 17,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion5.png`,
    widthFrame: 2176 / 17,
    heightFrame: 128,
    steps: 17,
    fps: 12,
    wrap: 17,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosionstrip13.png`,
    widthFrame: 2548 / 13,
    heightFrame: 190,
    steps: 13,
    fps: 8,
    wrap: 13,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion-4.png`,
    widthFrame: 4096 / 8,
    heightFrame: 4096 / 8,
    steps: 64,
    fps: 48,
    wrap: 8,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion-3.png`,
    widthFrame: 4096 / 8,
    heightFrame: 4096 / 8,
    steps: 64,
    fps: 30,
    wrap: 8,
  },
  {
    image: `${process.env.PUBLIC_URL}/static/explosions/explosion-1.png`,
    widthFrame: 4096 / 8,
    heightFrame: 4096 / 8,
    steps: 64,
    fps: 30,
    wrap: 8,
  },
]

const explosionframes = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosionframes.png`}
  widthFrame={1024 / 8}
  heightFrame={384 / 3}
  steps={24}
  fps={12}
  isResponsive={false}
/>

const expl2 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/expl2.png`}
  widthFrame={256 / 4}
  heightFrame={192 / 3}
  steps={12}
  fps={10}
/>

const boom3 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/boom3.png`}
  widthFrame={128}
  heightFrame={128}
  steps={64}
  fps={60}
/>

const explosion2 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion2.png`}
  widthFrame={100}
  heightFrame={100}
  steps={60}
  fps={36}
/>

const explosion = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion.png`}
  widthFrame={256 / 4}
  heightFrame={256 / 4}
  steps={16}
  fps={11}
/>

const explosion_1 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion-1.png`}
  widthFrame={4096 / 8}
  heightFrame={4096 / 8}
  steps={64}
  fps={30}
/>

const explosionstrip13 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosionstrip13.png`}
  widthFrame={2548 / 13}
  heightFrame={190}
  steps={13}
  fps={8}
/>

const explosion_3 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion-3.png`}
  widthFrame={4096 / 8}
  heightFrame={4096 / 8}
  steps={64}
  fps={30}
/>

const explosion_4 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion-4.png`}
  widthFrame={4096 / 8}
  heightFrame={4096 / 8}
  steps={64}
  fps={48}
/>

const explosion3 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion3.png`}
  widthFrame={2176 / 17}
  heightFrame={128}
  steps={17}
  fps={12}
/>

const explosion4 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion4.png`}
  widthFrame={2176 / 17}
  heightFrame={128}
  steps={17}
  fps={12}
/>

const explosion5 = <Spritesheet
  image={`${process.env.PUBLIC_URL}/static/explosions/explosion5.png`}
  widthFrame={2176 / 17}
  heightFrame={128}
  steps={17}
  fps={12}
/>



// const explosions = [expl2, explosion, explosion2, explosion_1, explosion_3, explosion_4, explosionframes, explosionstrip13, boom3, explosion3, explosion4, explosion5]
const explosions = [explosion, explosion2, explosion_3, explosion_4, explosionframes, explosion3]
const exp = _.sample(explosions)



const playv = (height) => keyframes`
  0% {
    background-position-y: 0px;
  }
  100% {
    background-position-y: -${height}px;
  }
`

const playh = (width) => keyframes`
  0% {
    background-position-x: 0px;
  }
  100% {
    background-position-x: -${width}px;
  }
`
const AnimatedSprite = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  position: absolute;
  border: solid 1px cyan;
  transform: scale(0.5);
  animation: ${props => css`${playv(props.imageHeight)} ${props.duration}s steps(${props.rows}) infinite, ${playh(props.imageWidth)} ${props.duration / props.rows}s steps(${props.columns}) ${props.rows}`}
}
`

const Sprite = `
  width: $squareWidth;
  height: $squareHeigth;
  background-image: url($imgUrl) no-repeat center / 85%;
  position: relative;
  border: solid 1px black;
  -webkit-animation: playvsquare $spriteAnimationTime*$itemNbColumns*$itemNbLines steps($itemNbLines) infinite, playhsquare $spriteAnimationTime*$itemNbColumns steps($itemNbColumns) infinite; 
}

@-webkit-keyframes playvsquare {
   0% { background-position-y:   0px; }
 100% { background-position-y: -$imageHeigth; }
}

@-webkit-keyframes playhsquare {
   0% { background-position-x:   0px; }
 100% { background-position-x: -$imageWidth; }
}
`
const coinSprite = {
  widthFrame: 53,
  heightFrame: 53,
  imageWidth: 320,
  imageHeight: 315,
  image: 'http://i.stack.imgur.com/CjMscm.jpg',
  steps: 6,
}

const monsterSprite = createSprite({
  url: 'https://i.stack.imgur.com/iyEe4.png',
  width: 710,
  height: 355,
  columns: 6,
  rows: 3,
  duration: 3,
})
const bubblesSprite = createSprite({
  url: 'https://mrbubblewand.files.wordpress.com/2009/08/magic_001.png',
  width: 960,
  height: 1152,
  columns: 5,
  rows: 6,
  duration: 2,
})
console.log('bubbles', bubblesSprite)
console.log('monster', monsterSprite)
function createSprite({ url, width, height, columns, rows, duration }) {
  return {
    image: url,
    imageWidth: width,
    imageHeight: height,
    columns,
    rows,
    spriteAnimationTime: duration,
    steps: columns * rows,
    fps: columns * rows / duration,
    widthFrame: width / columns,
    heightFrame: height / rows,
    duration,
  }
}

function getOpacity(detonateIn) {
  switch (detonateIn) {
    case 1:
      return 1
    case 2:
      return 0.6
    case 3:
      return 0.3
    default:
      return 0.1
  }
}
class Asteroids extends React.Component {
  componentDidMount() {
    explosions.forEach(sprite => {
      console.log('sprite', sprite, sprite.props.image)
      new Image().src = sprite.props.image
    })
  }
  render() {
    // return null
    var { gridSize, asteroids } = this.props;
    console.log('render Asteroids', asteroids)
    var tileSize = 100 / gridSize;
    var astroidRenderer = _.map(asteroids, (asteroid, index) => {
      return asteroid.style < 10 ? (
        <div
          key={index}
          className={`clash-asteroid clash-asteroid-${asteroid.style}`}
          style={{
            border: '1px dashed yellow',
            top: tileSize * asteroid.position[0] + "vmin",
            left: tileSize * asteroid.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            opacity: getOpacity(asteroid.detonateIn),
          }}
        >{asteroid.detonateIn}</div>) : (
          <div className="clash-asteroid" style={{
            border: '1px dashed red',
            top: tileSize * asteroid.position[0] + "vmin",
            left: tileSize * asteroid.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin"
          }}
          >
            {explosion2}
          </div>
        )
    });
    var astroidRenderer2 = _.map(asteroids, (asteroid, index) => {
      if (asteroid.style < 10) {
        return (<div
          key={index}
          className={`clash-asteroid clash-asteroid-${asteroid.style}`}
          style={{
            border: '1px dashed yellow',
            top: tileSize * asteroid.position[0] + "vmin",
            left: tileSize * asteroid.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin",
            opacity: 1 - asteroid.detonateIn * 0.2,
          }}
        />)
      }
      const sprite = sprites[asteroid.style - 10]
      return (
        <div className="clash-asteroid" style={{
          border: '1px dashed red',
          top: tileSize * asteroid.position[0] + "vmin",
          left: tileSize * asteroid.position[1] + "vmin",
          width: tileSize + "vmin",
          height: tileSize + "vmin"
        }}
        >
          <Spritesheet {...sprite} />
        </div>
      )
    });
    let testasteroids = []//explosions.map((exp, i) => ({ style: 10 + i, position: [Math.floor(i / gridSize), i % gridSize] }))
    // testasteroids = testasteroids.concat(explosions.map((exp, i) => ({ style: 10 + i, position: [2 + Math.floor(i / gridSize), i % gridSize] })))
    // testasteroids = testasteroids.concat(explosions.map((exp, i) => ({ style: 10 + i, position: [4 + Math.floor(i / gridSize), i % gridSize] })))
    // const asteroid = _.sample(testasteroids)
    console.log('test', testasteroids)
    return (
      <div className="clash-layer animation-glow" >
        {testasteroids.map(asteroid => {
          console.log('testast', asteroid, tileSize)
          const sprite = sprites[asteroid.style - 10]
          console.log('sprite', sprite)
          return (<div key={Math.random()} className="clash-asteroid" style={{
            border: '1px dashed green',
            top: tileSize * asteroid.position[0] + "vmin",
            left: tileSize * asteroid.position[1] + "vmin",
            width: tileSize + "vmin",
            height: tileSize + "vmin",
          }}
          >
            {}
            {/* <Spritesheet {...sprite} /> */}
            {/* <AnimatedSprite {...bubblesSprite} /> */}

          </div>
          )
        })}
        {/* <div className="clash-asteroid" > */}
        {/* <AnimatedSprite {...monsterSprite} /> */}
        {/* </div> */}
        {astroidRenderer}
      </div>
    );
  }
}
Asteroids.propTypes = {
  gridSize: PropTypes.number.isRequired,
  asteroids: PropTypes.array
};

export default Asteroids;
