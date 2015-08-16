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

  execute(playerState, enemiesStates, gameEnvironment) {
    return this._playerAI(playerState, enemiesStates, gameEnvironment);
  }
}

module.exports = PlayerClass;
