import generateId from "./../lib/string-tools";

class PlayerClass {
  constructor(options) {
    this.id = generateId.generateBase32String(8);
    this.info = options.info;
    this.name = options.info.name;
    this.ai = options.ai;
  }

  execute(playerState, enemyState, gameEnvironment) {
    try {
      return this.ai(playerState, enemyState, gameEnvironment);
    } catch (e) {
      console.error("!", e);
    }
  }
}

export default PlayerClass;
