let soundsOn = true
let musicVolume = 0.4

export const lasers = {
  laser0: new Audio('static/sounds/lasers/laser0.mp3'),
  laser1: new Audio('static/sounds/lasers/laser1.mp3'),
  laser2: new Audio('static/sounds/lasers/laser2.mp3'),
  laser3: new Audio('static/sounds/lasers/laser3.mp3'),
  laser4: new Audio('static/sounds/lasers/laser4.mp3'),
  laser5: new Audio('static/sounds/lasers/laser5.mp3'),
  laser6: new Audio('static/sounds/lasers/laser6.mp3'),
  laser7: new Audio('static/sounds/lasers/laser7.mp3'),
  laser8: new Audio('static/sounds/lasers/laser8.mp3'),
}

export const explosions = {
  explode0: new Audio('static/sounds/explosions/explode0.wav'),
  explode1: new Audio('static/sounds/explosions/explode1.wav'),
  explode2: new Audio('static/sounds/explosions/explode2.wav')
}
explosions.explode0.volume = 0.4
explosions.explode1.volume = 0.4
explosions.explode2.volume = 1

export const streaks = {
  firstBlood: new Audio('static/sounds/streak/first-blood.mp3'),
  doubleKill: new Audio('static/sounds/streak/double-kill.mp3'),
  tripleKill: new Audio('static/sounds/streak/triple-kill.mp3'),
  monsterKill: new Audio('static/sounds/streak/monster-kill.mp3'),
  killingSpree: new Audio('static/sounds/streak/killing-spree.mp3'),
  dominating: new Audio('static/sounds/streak/dominating.mp3'),
  rampage: new Audio('static/sounds/streak/rampage.mp3'),
  ownage: new Audio('static/sounds/streak/ownage.mp3')
}

const music = {
  theme0: new Audio('static/sounds/music/flight.ogg'),
  theme1: new Audio('static/sounds/music/action.ogg'),
}
const themeLoop = [
  music.theme0,
  music.theme0,
  music.theme1,
  music.theme1,
  music.theme0,
  music.theme1,
]

let themeIndex = 0
let currentMusic = themeLoop[themeIndex]

export function enableSounds() { soundsOn = true }
export function disableSounds() { soundsOn = false }

export async function playSound(sound) {
  if (!soundsOn) {
    // console.log('sounds off, skipping', sound.src)
    return
  }
  try {
    await sound.play()
    // console.log('played sound', sound.src)
  } catch (err) {
    console.error('error playing sound', err, sound.src)
  }
}

export async function startMusic() {
  try {
    // console.log('playMusic', themeIndex, this.currentMusic.src)
    currentMusic.volume = musicVolume
    await currentMusic.play()
    // console.log('playing music', themeIndex, currentMusic.src)
    currentMusic.addEventListener('ended', (evt) => {
      // console.log('ended', this.currentMusic, evt)
      // this.currentMusic.currentTime = 0
      // console.log('reset', this.currentMusic.currentTime, this.currentMusic.ended)
      themeIndex = (themeIndex + 1) % themeLoop.length
      // console.log('new music', themeIndex)
      currentMusic = themeLoop[themeIndex]
      setImmediate(startMusic)
    }, { once: true })
  } catch (err) {
    console.error('error playing music', err)
  }

}

export function stopMusic() {
  currentMusic.pause()
  // console.log('paused music', currentMusic.src, themeIndex)
}
