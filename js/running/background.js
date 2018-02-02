// 绘制游戏无限滚动背景
const bgImg = new Image(); // 进入游戏前的背景
bgImg.src = "images/bg2.jpg";

const startImgs = new Image(); // 进入游戏后的移动背景
startImgs.src = "images/startbg.png";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export default class BackGround {
  constructor(ctx) {
    this.startImgs = startImgs;

    this.imgs = bgImg;
    this.height = 512;
    this.width = 512;

    this.top = 0;
  }

  // 移动背景
  step() {
    this.top += 2;

    if (this.top >= screenHeight) this.top = 0;
  }

  // 绘制移动背景到画布上
  paint(ctx) {
    ctx.drawImage(
      this.imgs,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      screenWidth,
      screenHeight
    );

    ctx.drawImage(
      this.imgs,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      screenWidth,
      screenHeight
    );
  }

  drawToCanvas(ctx) {
    ctx.drawImage(this.startImgs, 0, 0, screenWidth, screenHeight);
  }
}
