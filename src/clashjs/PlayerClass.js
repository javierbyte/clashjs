var fx = require('./../lib/sound-effects');

class PlayerClass {
  constructor(options) {
    this._playerInfo = options.info;
    this._playerAI = options.ai;
  }

  getInfo() {
    return this._playerInfo;
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
