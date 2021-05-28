import { RestartButton } from "../components/restart-button.js";

export class Welcome extends Phaser.Scene {
    constructor() {
      super({ key: 'welcome' });
      this.restartButton = new RestartButton(this);
    }
  
    preload() {
      this.load.image('fondowelcome', 'images/fondowelcome.jpg')
      this.restartButton.preload();
    }
    
    create() {
      this.add.image(400, 250, 'fondowelcome');
      this.restartButton.create();
    }
  }