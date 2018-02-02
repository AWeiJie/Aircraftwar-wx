import Bullet from "./enemyBullet";
import Music from "./music";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// ****************敌方飞机的创建初始化****************
const BlastLength = 19;
const BlastURL = "images/explosion";

const BlastArr = []; // 存储爆破图片的数组
for (let i = 0; i < BlastLength; i++) {
  BlastArr[i] = new Image();
  BlastArr[i].src = BlastURL + (i + 1) + ".png";
}

let imgsOne = []; // 小飞机
imgsOne[0] = new Image();
imgsOne[0].src = "images/enemy1.png";

imgsOne = imgsOne.concat(BlastArr);

let imgsTwo = []; // 中飞机
imgsTwo[0] = new Image();
imgsTwo[0].src = "images/enemy2.png";

imgsTwo = imgsTwo.concat(BlastArr);

let imgsThree = []; // 大飞机
imgsThree[0] = new Image();
imgsThree[0].src = "images/enemy3.png";

imgsThree = imgsThree.concat(BlastArr);

let bossOne = []; // BOSS1
bossOne[0] = new Image();
bossOne[0].src = "images/boss1.png";

bossOne = bossOne.concat(BlastArr);

let bossTwo = []; // BOSS2
bossTwo[0] = new Image();
bossTwo[0].src = "images/boss2.png";

bossTwo = bossTwo.concat(BlastArr);

let bossThree = []; // BOSS3
bossThree[0] = new Image();
bossThree[0].src = "images/boss3.png";

bossThree = bossThree.concat(BlastArr);

// 初始化必要的数据
const images1 = {
  imgs: imgsOne,
  width: 59,
  height: 40,
  count: 1,
  life: 1,
  score: 1,
  fileUp: 1,
  type: "small"
};

const images2 = {
  imgs: imgsTwo,
  width: 60,
  height: 60,
  count: 1,
  life: 5,
  score: 5,
  fileUp: 2,
  type: "medium"
};

const images3 = {
  imgs: imgsThree,
  width: 72,
  height: 54,
  count: 1,
  life: 10,
  score: 10,
  fileUp: 3,
  type: "big"
};

const boss1 = {
  imgs: bossOne,
  width: 150,
  height: 129,
  count: 1,
  life: 1000,
  score: 1000,
  fileUp: 1,
  type: "boss"
};

const boss2 = {
  imgs: bossTwo,
  width: 100,
  height: 85,
  count: 1,
  life: 1000,
  score: 1000,
  fileUp: 1,
  type: "boss"
};

const boss3 = {
  imgs: bossThree,
  width: 148,
  height: 85,
  count: 1,
  life: 1000,
  score: 1000,
  fileUp: 1,
  type: "boss"
};

// 单独某个敌机对象
class EnemyOne {
  constructor(config) {
    this.img = config.imgs;
    this.width = config.width;
    this.height = config.height;
    this.count = config.count;
    this.type = config.type;
    this.life = config.life; // 生命值
    this.score = config.score; // 打击得分
    this.fileUp = config.fileUp;
    this.x = Math.random() * (screenWidth - this.width);
    this.y = -this.height;
    this.index = 0;
    this.time = 0;
    this.canDown = false; // 是否被撞击
    this.canDelet = false; // 是否删除
    this.bulletArr = []; // 子弹数组
    this.frame = 0;

    this.offsetx = 1;
    this.offsety = 0;
  }

  // 绘制到画布
  drawToCanvas(ctx) {
    ctx.drawImage(
      this.img[this.index],
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // 移动
  step() {
    if (this.canDown) {
      this.index++;
      if (this.index === this.img.length - 1) {
        this.canDelet = true;
        this.canDown = false; // 是否被撞击
      }
    } else {
      switch (this.type) {
        case "small":
          this.index = 0;
          this.y += 3;
          break;
        case "medium":
          this.index = 0;
          this.y += 2;
          break;
        case "big":
          this.index = 0;
          this.y += 1;
          break;
        case "boss":
          if (this.x + this.width >= screenWidth) {
            //到达右边
            this.offsetx = -1;
          } else if (this.x <= 0) {
            this.offsetx = 1;
          }
          this.x = this.x + this.offsetx;

          if (this.y <= 0) {
            this.offsety = 1;
          } else if (this.y + this.height >= screenHeight / 2) {
            this.offsety = -0.5;
          }
          this.y = this.y + this.offsety;
          break;
      }
    }
  }

  // 敌机被撞击的规则  被子弹或者我方飞机
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
    this.index = this.count; // 切换到第一张爆破
    const Musics = new Music();
    Musics.playExplosion();
  }

  // 射击
  shoot() {
    const Bullets = new Bullet(
      this.x,
      this.y,
      this.width,
      this.fileUp,
      this.type
    );
    this.bulletArr.push(Bullets);
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
      if (this.bulletArr[i].y >= screenHeight || this.bulletArr[i].canDown) {
        this.bulletArr.splice(i, 1);
      }
    }
  }
}

/**
 * 创建所有敌机对象
 */
export default class Enemy {
  constructor(ctx) {
    this.EnemyArr = []; // 存储敌机的数组
    this.speed = 0; // 创建敌机的速度控制
    this.bossType = boss1
  }

  // 创建敌机对象数组
  creatEnemy(score) {
    this.speed++;
    if (this.EnemyArr.length > 10 || this.speed % 20 !== 0) {
      return;
    }
    let num = Math.random() * 100;
    if (num < 60) {
      const imgs1 = new EnemyOne(images1);
      this.EnemyArr.push(imgs1);
    } else if (num < 80) {
      const imgs2 = new EnemyOne(images2);
      this.EnemyArr.push(imgs2);
    } else if (num < 90) {
      const imgs3 = new EnemyOne(images3);
      this.EnemyArr.push(imgs3);
    } else {
      if (this.EnemyArr.length > 0 && this.EnemyArr[0].type !== "boss") {
        const boss = new EnemyOne(this.bossType);
        this.EnemyArr.unshift(boss);
        if(this.bossType === boss1) {
          this.bossType = boss2
        } else if(this.bossType === boss2) {
          this.bossType = boss3
        } else {
          this.bossType = boss1
        }
      }
    }
  }

  // 绘制敌方所有飞机
  paintAllEnemy(ctx) {
    for (let i = 0; i < this.EnemyArr.length; i++) {
      this.EnemyArr[i].drawToCanvas(ctx);

      // 不断创建我方子弹对象
      this.EnemyArr[i].frame++;
      if (this.EnemyArr[i].frame % 120 === 0) {
        this.EnemyArr[i].shoot();
      }
      this.EnemyArr[i].deletBullet(); // 删除超出画布的子弹

      this.EnemyArr[i].paintAllBullet(ctx); // 绘制所有子弹
      this.EnemyArr[i].stepAllBullet(); // 移动所有子弹
    }
  }

  // 移动所有敌机
  stepAllEnemy() {
    for (let i = 0; i < this.EnemyArr.length; i++) {
      this.EnemyArr[i].step();
    }
  }

  // 清除飞出画布的敌机 || 被撞击
  deletEnemy() {
    for (let i = 0; i < this.EnemyArr.length; i++) {
      if (this.EnemyArr[i].y >= screenHeight || this.EnemyArr[i].canDelet) {
        this.EnemyArr.splice(i, 1);
      }
    }
  }
}
