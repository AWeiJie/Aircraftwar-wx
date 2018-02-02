// 我方火力能源
const fileUp = new Image();
fileUp.src = "images/up.png";

// 我方生命能源
const moreLife = new Image();
moreLife.src = "images/life.png";

// 导弹
const missile = new Image();
missile.src = "images/gomissile.png";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// 我方火力能源初始化必要的数据
const fileUpImg = {
  img: fileUp,
  width: 35,
  height: 32,
  type: "file"
};

// 我方生命能源初始化必要的数据
const moreLifeImg = {
  img: moreLife,
  width: 35,
  height: 34,
  type: "life"
};

// 我方生命能源初始化必要的数据
const gomissile = {
  img: missile,
  width: 35,
  height: 34,
  type: "missile"
};

// 每个能源对象
class EnergyOne {
  constructor(config) {
    this.img = config.img;
    this.width = config.width;
    this.height = config.height;
    this.type = config.type;

    this.offsetx = 1;
    this.offsety = 1;

    this.x = Math.random() * (screenWidth - this.width);
    this.y = -this.height;
  }

  // 移动
  step() {
    if (this.x + this.width / 2 + 20 >= screenWidth) {
      this.offsetx = -1;
    } else if (this.x - this.width / 2 <= 0) {
      this.offsetx = 1;
    }
    this.x = this.x + this.offsetx;

    if (this.y <= 0) {
      this.offsety = 2;
    } else if (this.y + this.height >= screenHeight) {
      this.offsety = -1;
    }
    this.y = this.y + this.offsety;
  }

  // 绘制到画布上
  drawToCanvas(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // 被撞击的规则
  checkHit(conment) {
    return (
      conment.y <= this.y + this.height &&
      conment.x + conment.width >= this.x &&
      conment.x <= this.x + this.width &&
      conment.y + conment.height >= this.y
    );
  }
}

export default class Energy {
  constructor(ctx) {
    this.EnergyArr = []; // 存储能源的数组
    this.speed = 0; // 创建能源的速度控制
  }

  // 创建能源数组
  creatEnergy() {
    this.speed++;
    if (this.EnergyArr.length > 2 || this.speed % 100 !== 0) {
      return;
    }
    let num = Math.random() * 100;
    if (num < 80) {
      const fileUp = new EnergyOne(fileUpImg);
      this.EnergyArr.push(fileUp);
    } else if (num < 95) {
      const moreLife = new EnergyOne(moreLifeImg);
      this.EnergyArr.push(moreLife);
    } else {
      const getGomissile = new EnergyOne(gomissile);
      this.EnergyArr.push(getGomissile);
    }
  }

  // 绘制所有能源
  paintAllEnergy(ctx) {
    for (let i = 0; i < this.EnergyArr.length; i++) {
      this.EnergyArr[i].drawToCanvas(ctx);
    }
  }

  // 移动所有能源
  stepAllEnergy() {
    for (let i = 0; i < this.EnergyArr.length; i++) {
      this.EnergyArr[i].step();
    }
  }
}
