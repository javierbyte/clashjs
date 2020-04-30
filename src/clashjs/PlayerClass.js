import generateId, {generateBotName} from "./../lib/string-tools";

class PlayerClass {
  constructor(options) {
    this._id = generateId.generateBase32String(8);
    this._playerInfo = options.info || {name: this._id};
    this._playerAI = options.ai ? options.ai.bind({}) : ()=>{};
    if (!this._playerInfo.name) {
      this._playerInfo.name = generateBotName()
    }
    const style = parseInt(this._playerInfo.style, 10)
    if (isNaN(style) || style < 0 || style > 110) {
      // no style will randomly assign one
      this._playerInfo.style = undefined
    }
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
