var fx = require("./../lib/sound-effects");
var generateId = require("./../lib/string-tools").generateBase32String;

class PlayerClass {
  constructor(options) {
    this._id = generateId(8);
    this._playerInfo = options.info;
    this._playerAI = options.ai;
  }

  getId() {
    return this._id;
  }

  getInfo() {
    return this._playerInfo;
  }

  getName() {
    return this._playerInfo.name;
  }

  playExplosion() {
    var i = Math.round(Math.random() * 10) % 3;
    fx.explosions["explode" + i].play();
  }

  execute(playerState, enemiesStates, gameEnvironment) {
    try {
      return this._playerAI(playerState, enemiesStates, gameEnvironment);
    } catch (e) {
      console.error("!", e);
    }
  }
}

module.exports = PlayerClass;
