export class Game extends Phaser.Scene {

  constructor() {
    super({ key: 'game' });
  }

  preload() {
    this.load.image('fondo', 'images/fondo.png');
    this.load.image('platform', 'images/platform.png');
    this.load.image('ball', 'images/ball.png');
    this.load.image('bloque', 'images/bloque.png');
    this.load.image('ladrillos', 'images/ladrillos.jpg');
    this.load.image('setaroja', 'images/setaroja.png');
    this.load.image('setaverde', 'images/setaverde.png');
    this.load.image('goomba', 'images/goomba.png');

  }

  create() {
    this.add.image(400, 250, 'fondo');

    this.platform = this.physics.add.image(400, 430, 'platform');
    this.platform.setImmovable();
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.ball = this.physics.add.image(400, 400, 'ball');
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setData('glue', true);

    this.physics.world.setBoundsCollision(true, true, true, false);
    this.physics.add.collider(this.ball, this.platform, this.platformImpact, null, this);

    this.scoreText = this.add.text(16, 16, 'PUNTOS: 0', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'verdana, arial, sans-serif'
    });

    this.setasr = this.physics.add.group();
    this.setasr.create(250, 132, 'setaroja');
    this.setasr.create(380, 195, 'setaroja');
    this.setasr.create(510, 132, 'setaroja');
    this.setasr.create(122, 195, 'setaroja');



    this.setasv = this.physics.add.group();
    this.setasv.create(185, 165, 'setaverde');
    this.setasv.create(443, 165, 'setaverde');
    this.setasv.create(380, 100, 'setaverde');



    this.goombas = this.physics.add.group();
    this.goombas.create(250, 195, 'goomba');
    this.goombas.create(380, 132, 'goomba');



    this.physics.add.overlap(this.ball, this.setasr, this.setasrImpact, null, this);
    this.physics.add.overlap(this.ball, this.setasv, this.setasvImpact, null, this);
    this.physics.add.overlap(this.ball, this.goombas, this.goombaImpact, null, this);

    this.physics.add.collider(this.platform, this.setasr, this.setasrPlatImpact, null, this);
    this.physics.add.collider(this.platform, this.setasv, this.setasvPlatImpact, null, this);
    this.physics.add.collider(this.platform, this.goombas, this.goombaPlatImpact, null, this);

    this.bricks = this.physics.add.staticGroup({
      key: ['bloque', 'ladrillos', 'bloque', 'ladrillos'],
      frameQuantity: 20,
      gridAlign: {
        width: 20,
        height: 4,
        cellWidth: 32,
        cellHeight: 32,
        x: 60,
        y: 100
      }
    });
    this.physics.add.collider(this.ball, this.bricks, this.brickImpact, null, this);

    this.TimerGrande = new Phaser.Time.TimerEvent({callback: this.encoger, callbackScope: this, paused:false, delay:5000, repeat:0})

  }

  init() {
    this.score = 0;
  }

  update() {
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-500);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(-500);
      }
    }
    else if (this.cursors.right.isDown) {
      this.platform.setVelocityX(500);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(500);
      }
    }
    else {
      this.platform.setVelocityX(0);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(0);
      }
    }

    if (this.ball.y > 500) {
      console.log('fin');
      this.scene.start('gameover');
    }

    if (this.cursors.up.isDown) {
      if (this.ball.getData('glue')) {
        this.ball.setVelocity(-75, -300);
        this.ball.setData('glue', false);
      }
    }
  }

  platformImpact(ball, platform) {
    let relativeImpact = ball.x - platform.x;
    if (relativeImpact > 0) {
      console.log('derecha!');
      ball.setVelocityX(10 * relativeImpact);
    } else if (relativeImpact < 0) {
      console.log('izquierda!');
      ball.setVelocityX(10 * relativeImpact);
    } else {
      console.log('centro!!');
      ball.setVelocityX(Phaser.Math.Between(-10, 10))
    }
  }

  brickImpact(ball, brick) {
    brick.disableBody(true, true);
    this.increasePoints(10);
    if (this.bricks.countActive() === 0) {
      this.scene.start('congratulations');
    };
  }

  increasePoints(points) {
    this.score += points;
    this.scoreText.setText('PUNTOS: ' + this.score);
  }

  setasrImpact(ball, setaroja) {
    setaroja.enableBody(false, 0, 0, true, true);
    setaroja.setVisible(true);
    setaroja.setVelocityY(40);
    setaroja.setVelocityX(0);
  }

  setasvImpact(ball, setaverde) {
    setaverde.enableBody(false, 0, 0, true, true);
    setaverde.setVisible(true);
    setaverde.setVelocityY(40);
    setaverde.setVelocityX(0);
  }

  goombaImpact(ball, goomba) {
    goomba.enableBody(false, 0, 0, true, true);
    goomba.setVisible(true);
    goomba.setVelocityY(40);
    goomba.setVelocityX(0);
  }

  setasrPlatImpact(platform, setaroja) {
    setaroja.disableBody(true, true);
    this.platform.setScale(2, 1);
    this.time.addEvent(this.TimerGrande);
  }

  setasvPlatImpact(platform, setaverde) {
    setaverde.disableBody(true, true);
    this.increasePoints(50);
  }

  goombaPlatImpact(platform, goomba) {
    goomba.disableBody(true, true);
    this.increasePoints(-20);
  }

  encoger() {
    this.platform.setScale(1,1)
  }
}


