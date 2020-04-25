import fx from "./../lib/sound-effects";
import generateId from "./../lib/string-tools";

class PlayerClass {
  constructor(options) {
    this._id = generateId.generateBase32String(8);
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
    fx.playSound(fx.explosions["explode" + i]);
  }

  execute(playerState, enemiesStates, gameEnvironment) {
    try {
      const action = this._playerAI(playerState, enemiesStates, gameEnvironment);
      // console.log('player turn', this.getName(), this.getId(), action)
      return action
    } catch (e) {
      console.error("!", e);
    }
  }
}

export default PlayerClass;
