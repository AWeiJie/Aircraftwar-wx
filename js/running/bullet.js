// 我方飞机子弹
const bullet = new Image();
bullet.src = "images/bullet1.png";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export default class Bullet {
  constructor(x = 0, y = 0, width = 80, fileUp) {
    this.img = bullet;
    this.width = 16;
    this.height = 30;
    this.x = x + width / 2 - this.width / 2;
    this.y = y - this.height;
    this.canDown = false;

    this.fileUp = fileUp; // 子弹火力
  }

  // 绘制到画布
  drawToCanvas(ctx) {
    if (this.fileUp === 3) {
      this.img.src = "images/bullet2.png";
    } else if (this.fileUp >= 4) {
      this.img.src = "images/bullet3.png";
    } else {
      this.img.src = "images/bullet1.png";
    }
    if (this.fileUp >= 2) {
      ctx.drawImage(this.img, this.x + 20, this.y, this.width, this.height);
      ctx.drawImage(this.img, this.x - 20, this.y, this.width, this.height);
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // 子弹移动
  step() {
    this.y -= 10;
  }
}
