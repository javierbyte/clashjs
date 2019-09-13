var utils = require('../lib/utils.js');
const actions = {
  attack: 'shoot'
}

const opositeDirections = {
  west : 'east',
  east : 'west',
  north: 'south',
  south: 'north'
}

const runAway = {
  west : 'south',
  east : 'north',
  north: 'east',
  south: 'west'
}

function calcDistance(playerState, ammos){
  const ammoDist = []
  for(let ammoPos of ammos){
    ammoDist.push(utils.getDistance(playerState.position, ammoPos))
  }
  return ammoDist
}
function findAmmo(playerState,enemiesStates, gameEnvironment){
  const ammoDist = calcDistance(playerState, gameEnvironment.ammoPosition)
  const ammoMinDistance = Math.min(...ammoDist)
  const ammoIndex = ammoDist.indexOf(ammoMinDistance)
  const ammoToFind = gameEnvironment.ammoPosition[ammoIndex]
  const enemyClose = enemiesStates.some((enemy) => {
    const enemyAmmoDist = calcDistance(enemy, gameEnvironment.ammoPosition)
    const min = Math.min(...enemyAmmoDist)
    const enemyAmmoIndex = enemyAmmoDist.indexOf(min)
    return enemy.isAlive && min < ammoMinDistance && enemyAmmoIndex === ammoIndex
  })
  if(enemyClose){
    return false
  }
  return ammoToFind
}

function checkForEnemyWithAmmo(playerState, enemiesStates){
  const enemiesWithAmmo = enemiesStates.filter((e) => e.ammo > 0)
  const posibleEnemy = enemiesWithAmmo.find((e) => {
    return utils.canKill(e, [playerState])
  })
  return posibleEnemy
}

function findCloseEnemy(playerState, enemiesStates){
  const enemyDist = calcDistance(playerState, enemiesStates.filter(e => e.isAlive).map(e => e.position))
  const enemyMinDistance = Math.min(...enemyDist)
  const enemyIndex = enemyDist.indexOf(enemyMinDistance)
  return enemiesStates[enemyIndex]
}

function isOpositeDirection(direction1, direction2){
  return opositeDirections[direction1] === direction2
}

function getAction(playerState, enemiesStates, gameEnvironment){
  if(playerState.ammo > 0 && utils.canKill(playerState, enemiesStates)){
    return actions.attack
  }

  const potentialEnemy = checkForEnemyWithAmmo(playerState, enemiesStates)
  if(potentialEnemy){
    const direction = utils.getDirection(playerState.position, potentialEnemy.position)
    if(direction === playerState.direction || isOpositeDirection(direction, playerState.direction)){
      return runAway[playerState.direction]
    }
    return 'move'
  }

  const closeEnemy = findCloseEnemy(playerState, enemiesStates)
  if(playerState.ammo > 0 && closeEnemy){
    const direction = utils.fastGetDirection(playerState.position, closeEnemy.position)
    if(playerState.direction !== direction){
      return direction
    }
    return 'move'
  }

  const closeAmmo = findAmmo(playerState, enemiesStates, gameEnvironment)
  if(closeAmmo){
    const direction = utils.fastGetDirection(playerState.position, closeAmmo)
    if(playerState.direction !== direction){
      
      return direction
    }
    return 'move'
  }
  return utils.randomMove()
}
var beogip = {
    
    info: {
      name: 'Beogip',
      style: 10
    },
    ai: (playerState, enemiesStates, gameEnvironment) => {
      return getAction(playerState, enemiesStates, gameEnvironment)
    }
  };
  module.exports = beogip;