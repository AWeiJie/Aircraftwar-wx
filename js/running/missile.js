const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// ****************导弹的创建初始化****************

let MissileImg = new Image();
MissileImg.src = "images/missile.png";

// 单独导弹对象
class MissileOne {
  constructor() {
    this.img = MissileImg;
    this.width = 88;
    this.height = 111;
    this.x = Math.random() * (screenWidth - this.width);
    this.y = innerHeight + this.height;
    this.canDown = false; // 是否被撞击
    this.canDelet = false; // 是否删除
    this.fileUp = 5; // 火力
  }

  // 绘制到画布
  drawToCanvas(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // 移动
  step() {
    this.y -= 3;
  }

  // 导弹被撞击的规则
  checkHit(conment) {
    return (
      conment.y <= this.y + this.height &&
      conment.x + conment.width >= this.x &&
      conment.x <= this.x + this.width &&
      conment.y + conment.height >= this.y
    );
  }

  // 被撞击进行爆炸
  down() {
    this.canDown = true;
  }
}

/**
 * 创建所有导弹对象
 */
export default class Missile {
  constructor(ctx) {
    this.MissileArr = []; // 存储导弹的数组
    this.speed = 0; // 创建导弹的速度控制
    this.creat = false;
  }

  // 创建导弹对象数组
  creatMissile() {
    this.speed++;
    if (this.MissileArr.length > 20 || this.speed % 20 !== 0 || !this.creat) {
      return;
    }
    const imgs1 = new MissileOne();
    this.MissileArr.push(imgs1);
  }

  // 绘制所有导弹
  paintAllMissile(ctx) {
    for (let i = 0; i < this.MissileArr.length; i++) {
      this.MissileArr[i].drawToCanvas(ctx);
    }
  }

  // 移动所有导弹
  stepAllMissile() {
    for (let i = 0; i < this.MissileArr.length; i++) {
      this.MissileArr[i].step();
    }
  }

  // 清除飞出画布的导弹 || 被撞击
  deletMissile() {
    for (let i = 0; i < this.MissileArr.length; i++) {
      if (
        this.MissileArr[i].y <= -this.MissileArr[i].height ||
        this.MissileArr[i].canDown
      ) {
        this.MissileArr.splice(i, 1);
      }
    }
  }
}
