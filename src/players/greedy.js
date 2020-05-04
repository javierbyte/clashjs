import utils from '../lib/utils'
import _ from 'lodash'

function compareDistance(start) {
  return (value) => utils.getDistance(start, value.position)
}

function closest(items, myPos) {
  // debugger;
  if (_.isEmpty(items)) return;
  const closest = _.sortBy(items, [compareDistance(myPos)])
  console.log('&g closest', closest)
  if (_.isEmpty(closest)) return;
  const dist = utils.getDistance(closest[0].position, myPos)
  console.log('&g dist', dist)
  return closest[0]
}

function smartMove(playerState, gridSize) {
  // avoid danger, don't go off board
  const rand = utils.randomMove()
  if (playerState.direction === 'east' && playerState.position[1] === gridSize - 1) {
    return _.sample(['north', 'west', 'south'])
  }
  if (playerState.direction === 'west' && playerState.position[1] === 0) {
    return _.sample(['north', 'east', 'south'])
  }
  if (playerState.direction === 'north' && playerState.position[0] === 0) {
    return _.sample(['east', 'west', 'south'])
  }
  if (playerState.direction === 'south' && playerState.position[0] === gridSize - 1) {
    return _.sample(['north', 'west', 'east'])
  }
  return rand
}

function canSee(items, myPos, direction) {
  let visible
  if (direction === 'north') {
    visible = items.filter(item => item.position[0] === myPos[0] && item.position[1] < myPos[1])
  }
  if (direction === 'south') {
    visible = items.filter(item => item.position[0] === myPos[0] && item.position[1] > myPos[1])
  }
  if (direction === 'east') {
    visible = items.filter(item => item.position[1] === myPos[1] && item.position[0] > myPos[1])
  }
  if (direction === 'west') {
    visible = items.filter(item => item.position[1] === myPos[1] && item.position[1] < myPos[1])
  }
  return visible
}

function canShoot(enemiesStates, myPos, direction, ammo) {
  if (!ammo) return false
  const visibleEnemies = canSee(enemiesStates, myPos, direction)
  return visibleEnemies.length
}

export default {
  info: {
    name: "🤑Greedy 🤑",
    style: 110,
  },
  ai: function (playerState, enemiesStates, gameEnvironment) {
    console.log('&g ------ starting turn ----------', this.turns)
    this.turns = (this.turns === undefined) ? 0 : this.turns++
    console.log('&g state', playerState, gameEnvironment, enemiesStates)
    if (utils.isOnAsteroid(playerState.position, gameEnvironment.asteroids)) {
      console.log('&&& greedy avoided asteroid', gameEnvironment.asteroids, playerState)
      return 'move'
    }
    const myPos = playerState.position
    if (canShoot(enemiesStates, myPos, playerState.direction, playerState.ammo)) {
      return 'shoot'
    }
    // find closest or best cargo
    const valuable = _.sortBy(gameEnvironment.cargos, 'value')
    console.log('&g valuablecargo', valuable)
    const closestAmmo = closest(gameEnvironment.ammoPosition.map(ammo => ({ position: ammo })), myPos)
    const closestCargo = closest(gameEnvironment.cargos, myPos)
    console.log('&g closest ammo & cargo', closestAmmo, closestCargo)
    const best = _.sortBy(gameEnvironment.cargos, [compareDistance(myPos), 'value'])
    // console.log('&g bestcargo', best)
    // const closestAmmo = closest(gameEnvironment.ammos, myPos)
    // console.log('&g closestAmmo', closestAmmo)

    const direction = utils.fastGetDirection(myPos, best[0].position)
    const dir2 = utils.fastGetDirection(myPos, best[0].position)
    if (direction) {
      console.log('&g dir', direction, playerState.direction, dir2)
      if (direction === playerState.direction) {
        return 'move'
      } else {
        return direction
      }
    }

    return smartMove(playerState, gameEnvironment.gridSize);
  },
}
