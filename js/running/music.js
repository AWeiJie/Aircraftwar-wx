
/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    this.startAudio = new Audio()
    this.startAudio.src = 'audio/bgm.mp3'

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/Battle.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    this.upAudio = new Audio()
    this.upAudio.src = 'audio/up.mp3'
  }

  playStart() {   // 游戏运行背景音乐
    this.startAudio.play()
  }

  playBgm() {   // 游戏运行背景音乐
    this.startAudio.pause()
    this.startAudio.currentTime = 0
    this.bgmAudio.play()
  }


  playExplosion() { // 爆破背景音乐
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  playUp() { // 能源背景音乐
    this.upAudio.currentTime = 0
    this.upAudio.play()
  }

  playOver() { // 结束背景音乐
    this.bgmAudio.pause()
    this.bgmAudio.currentTime = 0
    this.startAudio.play()
  }
}
