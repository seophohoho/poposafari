import { TEXTURE } from '../enums/texture';
import { InGameScene } from '../scenes/ingame-scene';
import { addWindow, Ui } from './ui';

export class ModalUi extends Ui {
  protected modalContainer!: Phaser.GameObjects.Container;
  private modalWindow!: Phaser.GameObjects.NineSlice;

  constructor(scene: InGameScene) {
    super(scene);
  }

  setup(): void {
    const ui = this.getUi();
    const width = this.getWidth();
    const height = this.getHeight();

    this.modalContainer = this.scene.add.container(width / 4, height / 4);
    this.modalWindow = addWindow(this.scene, TEXTURE.WINDOW_2, 0, 0, 170, 220, 16, 16, 16, 16).setScale(2);

    this.modalContainer.add(this.modalWindow);
    this.modalContainer.setVisible(false);

    ui.add(this.modalContainer);
  }
  show(): void {
    this.modalContainer.setVisible(true);

    this.modalContainer.y += 48;
    this.modalContainer.setAlpha(0);

    this.scene.tweens.add({
      targets: this.modalContainer,
      duration: 700,
      ease: 'Sine.easeInOut',
      y: '-=48',
      alpha: 1,
    });
  }
  clean(): void {
    this.modalContainer.setVisible(false);
    this.modalContainer.y = this.scene.game.canvas.height / 4;
  }
  pause(onoff: boolean): void {}

  update(time: number, delta: number): void {}
}
