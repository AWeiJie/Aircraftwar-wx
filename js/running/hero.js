// 玩家相关常量设置
import Bullet from "./bullet";
import Music from './music'

let play = [];
play[0] = new Image();
play[0].src = "images/hero.png"; // 火力1 的战机形态

play[1] = new Image();
play[1].src = "images/hero2.png"; // 火力2 的战机

play[2] = new Image();
play[2].src = "images/hero3.png"; // 火力3 的战机

const BlastLength = 19;
const BlastURL = "images/explosion";

const BlastArr = []; // 存储爆破图片的数组
for (let i = 0; i < BlastLength; i++) {
  BlastArr[i] = new Image();
  BlastArr[i].src = BlastURL + (i + 1) + ".png";
}

play = play.concat(BlastArr);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export default class Player {
  constructor(ctx) {
    // 战机配置
    this.img = play;
    this.width = 80;
    this.height = 80;
    this.x = (screenWidth - this.width) / 2;
    this.y = screenHeight - this.height - 30;

    this.index = 0;
    this.count = 2;

    this.canDown = false; // 是否被撞击

    this.bulletArr = []; // 存储所有子弹的数组

    this.touched = false; // 手指移动的时候标识手指是否已经在飞机上

    this.frame = 0; // 控制子弹的射击速度，实现发射效果

    this.fileUp = 1; // 火力控制

    this.type = "Player";

    this.initEvent(); // 初始化飞机跟随触摸移动事件
  }

  // 绘制战机到画布
  drawToCanvas(ctx) {
    // 根据火力改变战机形态
    if (this.canDown) {
      if (this.index < this.count) {
        this.index = this.count;
      }
      this.index++;

      if (this.index === this.img.length - 1) {
        this.index = 0;
        this.canDown = false;
      }
    } else {
      if (this.fileUp === 3) {
        this.index = 1;
      } else if (this.fileUp === 4) {
        this.index = 2;
      }
    }
    ctx.drawImage(
      this.img[this.index],
      this.x,
      this.y,
      this.width,
      this.height
    );

    // 不断创建我方子弹对象
    this.frame++;
    let num = 10;
    if (this.fileUp >= 4) {
      num = 5;
    }
    if (this.frame % num === 0) {
      this.shoot();
    }
    this.deletBullet(); // 删除超出画布的子弹

    this.paintAllBullet(ctx); // 绘制所有子弹
    this.stepAllBullet(); // 移动所有子弹
  }

  // 判断手指是否在飞机上
  checkIsFingerOnAir(x, y) {
    const deviation = 30;

    return !!(
      x >= this.x - deviation &&
      y >= this.y - deviation &&
      x <= this.x + this.width + deviation &&
      y <= this.y + this.height + deviation
    );
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2;
    let disY = y - this.height / 2;

    if (disX < 0) disX = 0;
    else if (disX > screenWidth - this.width) disX = screenWidth - this.width;

    if (disY <= 0) disY = 0;
    else if (disY > screenHeight - this.height)
      disY = screenHeight - this.height;

    this.x = disX;
    this.y = disY;
  }

  // 飞机跟随触摸移动
  initEvent() {
    canvas.addEventListener(
      "touchstart",
      (e => {
        e.preventDefault();

        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        //
        if (this.checkIsFingerOnAir(x, y)) {
          this.touched = true;

          this.setAirPosAcrossFingerPosZ(x, y);
        }
      }).bind(this)
    );

    canvas.addEventListener(
      "touchmove",
      (e => {
        e.preventDefault();

        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        if (this.touched) this.setAirPosAcrossFingerPosZ(x, y);
      }).bind(this)
    );

    canvas.addEventListener(
      "touchend",
      (e => {
        e.preventDefault();

        this.touched = false;
      }).bind(this)
    );
  }

  // 飞机被撞击的规则  被敌机或者敌方子弹
  checkHit(conment) {
    return (
      conment.y <= this.y + this.height &&
      conment.x + conment.width >= this.x &&
      conment.x <= this.x + this.width &&
      conment.y + conment.height >= this.y
    );
  }

  // 创建子弹对象数组  射击
  shoot() {
    const MyBullet = new Bullet(this.x, this.y, this.width, this.fileUp);
    this.bulletArr.push(MyBullet);
    // const Musics = new Music()
    // Musics.playShoot()
  }

  // 绘制数组里的所有子弹
  paintAllBullet(ctx) {
    for (let i = 0; i < this.bulletArr.length; i++) {
      this.bulletArr[i].drawToCanvas(ctx);
    }
  }

  // 移动所有子弹
  stepAllBullet() {
    for (let i = 0; i < this.bulletArr.length; i++) {
      this.bulletArr[i].step();
    }
  }

  // 删除超出画布的子弹 || 已击中
  deletBullet() {
    for (let i = 0; i < this.bulletArr.length; i++) {
      if (
        this.bulletArr[i].y <= -this.bulletArr[i].height ||
        this.bulletArr[i].canDown
      ) {
        this.bulletArr.splice(i, 1);
      }
    }
  }
}
