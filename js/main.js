import BackGround from "./running/background"; // 引入背景文件
import Hero from "./running/hero"; // 引入我方战机文件
import Energy from "./running/energy"; // 引入我方能源文件
import Missile from "./running/missile"; // 引入我方导弹文件
import Enemy from "./running/enemy"; // 引入敌方飞机文件
import Music from "./running/music";
import GameOver from "./running/ganeover"; // 引入游戏结束文件

let ctx = canvas.getContext("2d");
let state = 0; // 游戏状态

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    //定义游戏的 5 个阶段
    this.START = 0; //欢迎
    this.STARTTING = 1; //过渡
    this.RUNNING = 2; //运行
    this.PAUSED = 3; //暂停
    this.GAMEOVER = 4; //结束

    this.score = 0; // 得分
    this.life = 3; // 生命值

    this.restart(); // 初始化

    this.clearTime = null;
  }

  // 游戏开始前初始化
  restart() {
    this.Enemy = new Enemy(ctx); // 敌机
    this.bg = new BackGround(ctx); // 背景
    this.hero = new Hero(ctx); // 战机
    this.Energy = new Energy(); // 能源
    this.Missile = new Missile(); // 导弹
    this.Music = new Music();
    this.Music.playStart();
    this.GameOver = new GameOver(); // 结束

    // 绑定游戏欢迎界面点击事件
    canvas.addEventListener("touchstart", this.startGame.bind(this));

    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }

  // 点击触摸事件
  startGame(e) {
    e.preventDefault();
    if (state === this.START) {
      // 进入游戏事件
      state = this.RUNNING;
      this.Music.playBgm();
    } else if (state === this.GAMEOVER) {
      // 游戏结束后的触摸事件 重新开始游戏
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      if (
        x >= screenWidth / 2 - 40 &&
        x <= screenWidth / 2 + 50 &&
        y >= screenHeight / 2 - 100 + 180 &&
        y <= screenHeight / 2 - 100 + 255
      ) {
        // 判断点击位置
        state = this.RUNNING;
        this.hero = new Hero(ctx);
        this.Enemy = new Enemy(ctx);
        this.score = 0; // 得分
        this.life = 3; // 生命值
        this.Music.playBgm();
      }
    }
  }

  testCheckHit() {
    // 检查所有敌机是否被撞击的方法 遍历所有敌机
    for (let i = 0; i < this.Enemy.EnemyArr.length; i++) {
      // 敌机被我方飞机撞
      if (this.Enemy.EnemyArr[i].checkHit(this.hero)) {
        this.Enemy.EnemyArr[i].life--;
        if (this.Enemy.EnemyArr[i].life === 0) {
          this.Enemy.EnemyArr[i].down();
          this.score += this.Enemy.EnemyArr[i].score;

          // this.hero.canDown = true;
          // this.life -= 1;
          // this.hero = new Hero(ctx);

          if (this.life === 0) {
            state = this.GAMEOVER;
            this.Music.playOver();
          }
        }
      }

      // 遍历我方发射子弹
      for (let n = 0; n < this.hero.bulletArr.length; n++) {
        // 敌机被子弹撞
        if (
          this.Enemy.EnemyArr[i].checkHit(this.hero.bulletArr[n]) &&
          !this.Enemy.EnemyArr[i].canDown
        ) {
          this.hero.bulletArr[n].canDown = true;
          this.Enemy.EnemyArr[i].life =
            this.Enemy.EnemyArr[i].life - this.hero.fileUp;
          if (this.Enemy.EnemyArr[i].life <= 0) {
            this.Enemy.EnemyArr[i].down();
            this.score += this.Enemy.EnemyArr[i].score;
          }
        }

        // BOSS被我方子弹击中
        if (
          this.Boss &&
          this.Boss.checkHit(this.hero.bulletArr[n]) &&
          !this.Boss.canDown
        ) {
          this.hero.bulletArr[n].canDown = true;
          this.Boss.life = this.Boss.life - this.hero.fileUp;
          if (this.Boss.life <= 0) {
            this.Boss.down();
            this.score += this.Boss.score;
          }
        }
      }

      // 被导弹撞
      for (let n = 0; n < this.Missile.MissileArr.length; n++) {
        // 敌机被导弹撞
        if (this.Enemy.EnemyArr[i].checkHit(this.Missile.MissileArr[n])) {
          this.Missile.MissileArr[n].canDown = true;
          this.Enemy.EnemyArr[i].down();
          this.Enemy.EnemyArr[i].life =
            this.Enemy.EnemyArr[i].life - this.Missile.MissileArr[n].fileUp;
          if (this.Enemy.EnemyArr[i].life <= 0) {
            this.Enemy.EnemyArr[i].down();
            this.score += this.Enemy.EnemyArr[i].score;
          }
        }
      }

      // 我方飞机被敌机子弹击中
      for (let n = 0; n < this.Enemy.EnemyArr[i].bulletArr.length; n++) {
        if (this.hero.checkHit(this.Enemy.EnemyArr[i].bulletArr[n])) {
          this.Enemy.EnemyArr[i].bulletArr[n].canDown = true;
          // this.hero.canDown = true;
          // this.life -= 1;
          // this.hero = new Hero(ctx);

          if (this.life === 0) {
            state = this.GAMEOVER;
            this.Music.playOver();
          }
        }
      }
    }

    // 检查所有能源是否被撞击的方法
    for (let i = 0; i < this.Energy.EnergyArr.length; i++) {
      if (this.Energy.EnergyArr[i].checkHit(this.hero)) {
        this.Music.playUp();
        if (this.Energy.EnergyArr[i].type === "file") {
          // 增加火力
          if (this.hero.fileUp >= 4) {
            this.hero.fileUp = 4;
          } else {
            this.hero.fileUp += 1;
          }
          console.log(this.hero.fileUp);
        } else if (this.Energy.EnergyArr[i].type === "life") {
          // 增加生命
          this.life = this.life + 1;
        } else if (this.Energy.EnergyArr[i].type === "missile") {
          // 发射导弹
          this.Missile.creat = true;
          this.clearTime = setTimeout(() => {
            this.Missile.creat = false;
            clearTimeout(this.clearTime);
            this.clearTime = null;
          }, 10000);
        }
        this.Energy.EnergyArr.splice(i, 1);
      }
    }
  }

  // 运行阶段的所有绘制
  runningPaint() {
    this.hero.drawToCanvas(ctx); // 绘制我方战机

    this.Energy.creatEnergy(); // 创建能源数组
    this.Energy.paintAllEnergy(ctx); // 绘制所有能源
    this.Energy.stepAllEnergy(); // 移动所有能源

    this.Missile.creatMissile();
    this.Missile.paintAllMissile(ctx);
    this.Missile.stepAllMissile();
    this.Missile.deletMissile();

    this.Enemy.creatEnemy(this.score); // 创建敌机数组
    this.Enemy.paintAllEnemy(ctx); // 绘制所有敌机
    this.Enemy.stepAllEnemy(); // 移动所有敌机
    this.Enemy.deletEnemy(); // 清除飞出画布的敌机

    this.testCheckHit(); // 检查撞击
  }

  // 每一帧重新绘制
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state !== this.START) {
      this.bg.paint(ctx); // 移动的背景
      this.bg.step();

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText("LIFE:" + this.life, 10, 30); // 生命值
      ctx.fillText("SCORE:" + this.score, 95, 30); // 得分
    }

    switch (state) {
      case this.START: //欢迎阶段
        this.bg.drawToCanvas(ctx);
        break;
      case this.RUNNING: //运行阶段
        this.runningPaint();
        break;
      case this.GAMEOVER: //结束阶段
        this.GameOver.renderGameOver(ctx, this.score);
        break;
    }
  }

  // 实现游戏帧循环绘制
  loop() {
    this.render();

    window.requestAnimationFrame(this.loop.bind(this), canvas);
  }
}
