var fx = require('./../lib/sound-effects');

class PlayerClass {
  constructor(options) {
    this._playerInfo = options.info;
    this._playerAI = options.ai;
    this._playerStats = {
      kills: 0,
      deaths: 0,
      ratio: 0
    }
  }

  getInfo() {
    return this._playerInfo;
  }

  getStats() {
    this._playerStats.ratio = this._playerStats.kills / this._playerStats.deaths;
    return this._playerStats;
  }

  getName() {
    return this._playerInfo.name;
  }

  playLaser() {
    fx.lasers['laser' + this.getInfo().style].play();
  }

  playExplosion() {
    var i = Math.round(Math.random() * 10) % 3;
    fx.explosions['explode' + i].play();
  }

  execute(playerState, enemiesStates, gameEnvironment) {
    return this._playerAI(playerState, enemiesStates, gameEnvironment);
  }
}

module.exports = PlayerClass;
