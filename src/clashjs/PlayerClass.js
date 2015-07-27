class PlayerClass {
  constructor(options) {
    this._playerInfo = options.info;
    this._playerAI = options.ai;
  }

  getInfo() {
    return this._playerInfo;
  }

  execute() {
    return this._playerAI();
  }
}

module.exports = PlayerClass;
