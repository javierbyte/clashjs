import utils from '../lib/utils.js';

export default {

  info: {
    name: 'Rogue Shadow',
    style: 1
  },

  ai: (playerState, enemiesStates, gameEnvironment) => {

    const goal = [0, 0];

    var direction =  utils.fastGetDirection(playerState.position, goal);

    if (playerState.direction === direction) {
      return 'move';
    } else {
      return direction;
    }

  }
}
