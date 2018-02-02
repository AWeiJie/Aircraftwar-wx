// 敌方飞机子弹
const bullet = new Image();
bullet.src = "images/enemyBullet.png";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export default class Bullet {
  constructor(x = 0, y = 0, width = 80, fileUp, type) {
    this.img = bullet;
    this.width = 16;
    this.height = 30;
    this.x = x + width / 2 - this.width / 2;
    this.y = y - this.height;
    this.canDown = false;
    this.type = type; // 飞机类型

    this.fileUp = fileUp; // 子弹火力
  }

  // 绘制到画布
  drawToCanvas(ctx) {
    if (this.type === "boss") {
      this.img.src = "images/bossbullet.png"
      ctx.drawImage(
        this.img,
        this.x,
        this.y + this.height * 2,
        this.width,
        this.height
      );
      ctx.drawImage(
        this.img,
        this.x + 20,
        this.y + this.height * 2,
        this.width,
        this.height
      );
      ctx.drawImage(
        this.img,
        this.x - 20,
        this.y + this.height * 2,
        this.width,
        this.height
      );
    } else {
      this.img.src = "images/enemyBullet.png"
      ctx.drawImage(
        this.img,
        this.x,
        this.y + this.height * 2,
        this.width,
        this.height
      );
    }
  }

  // 子弹移动
  step() {
    this.y += 4;
  }
}
