import { RestartButton } from "../components/restart-button.js";

export class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: 'gameover' });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image('gameover', 'images/gameover.png');
    this.restartButton.preload();
  }
  
  create() {
    this.add.image(410, 250, 'fondo');
    this.restartButton.create();
    this.gameoverImage = this.add.image(400, 200, 'gameover');
  }
}