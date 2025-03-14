import i18next from 'i18next';
import { TEXTURE } from '../enums/texture';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { addImage, addText, Ui } from './ui';
import { TEXTSTYLE } from '../enums/textstyle';
import { DEPTH } from '../enums/depth';
import { KeyboardManager } from '../managers';
import { KEY } from '../enums/key';
import { PokeBoxUi } from './pokebox-ui';
import { PokeboxBoxUi } from './pokebox-box-ui';
import { PokeboxBoxBgListUi } from './pokebox-box-bg-list-ui';

export class PokeboxBoxMenuUi extends Ui {
  private mode: OverworldMode;
  private pokeboxUi: PokeBoxUi;
  private pokeboxBoxUi: PokeboxBoxUi;
  private pokeboxBoxBgListUi: PokeboxBoxBgListUi;
  private targetPage!: number;

  private container!: Phaser.GameObjects.Container;
  private choiceContainer!: Phaser.GameObjects.Container;

  private btns: Phaser.GameObjects.Image[] = [];

  constructor(scene: InGameScene, mode: OverworldMode, pokeboxUi: PokeBoxUi, pokeboxBoxUi: PokeboxBoxUi) {
    super(scene);
    this.mode = mode;
    this.pokeboxUi = pokeboxUi;
    this.pokeboxBoxUi = pokeboxBoxUi;
    this.pokeboxBoxBgListUi = new PokeboxBoxBgListUi(scene, mode, pokeboxUi, this);
  }

  setup(): void {
    const width = this.getWidth();
    const height = this.getHeight();

    this.pokeboxBoxBgListUi.setup();

    this.container = this.scene.add.container(width / 2 + 730, height / 2 + 360);
    this.choiceContainer = this.scene.add.container(0, 0);

    const changeBackgroundWindow = addImage(this.scene, TEXTURE.CHOICE, 0, -20).setScale(1.4);
    const changeBackgroundText = addText(this.scene, -80, -20, i18next.t('menu:boxBackground'), TEXTSTYLE.CHOICE_DEFAULT).setOrigin(0, 0.5);
    const cancelWindow = addImage(this.scene, TEXTURE.CHOICE, 0, +50).setScale(1.4);
    const cancelText = addText(this.scene, -80, +50, i18next.t('sys:cancel'), TEXTSTYLE.CHOICE_DEFAULT).setOrigin(0, 0.5);
    this.btns.push(changeBackgroundWindow);
    this.btns.push(cancelWindow);
    this.choiceContainer.add(changeBackgroundWindow);
    this.choiceContainer.add(cancelWindow);
    this.choiceContainer.add(changeBackgroundText);
    this.choiceContainer.add(cancelText);

    this.container.add(this.choiceContainer);

    this.container.setVisible(false);
    this.container.setScale(2);
    this.container.setDepth(DEPTH.OVERWORLD_NEW_PAGE + 1);
    this.container.setScrollFactor(0);
  }

  show(data?: number): void {
    if (data) this.targetPage = data - 1;

    // console.log('pokebox-box-menu-ui: ' + this.targetPage);

    this.container.setVisible(true);
    this.pause(false);
  }

  clean(data?: any): void {
    this.container.setVisible(false);
    this.pause(true);
  }

  pause(onoff: boolean, data?: any): void {
    onoff ? this.block() : this.unblock();
  }

  private block() {}

  private unblock() {
    const keyboardMananger = KeyboardManager.getInstance();
    const keys = [KEY.UP, KEY.DOWN, KEY.SELECT, KEY.CANCEL];

    let start = 0;
    let end = 1;
    let choice = start;

    this.btns[choice].setTexture(TEXTURE.CHOICE_S);

    keyboardMananger.setAllowKey(keys);
    keyboardMananger.setKeyDownCallback((key) => {
      const prevChoice = choice;

      try {
        switch (key) {
          case KEY.UP:
            choice = Math.max(start, choice - 1);
            break;
          case KEY.DOWN:
            choice = Math.min(end, choice + 1);
            break;
          case KEY.SELECT:
            if (choice === 0) {
              this.exitUi(choice);
              this.pokeboxBoxBgListUi.show(this.targetPage + 1);
            } else {
              this.exitUi(choice);
              this.pokeboxBoxUi.pause(false);
            }
            break;
          case KEY.CANCEL:
            this.exitUi(choice);
            this.pokeboxBoxUi.pause(false);
            break;
        }
      } catch (error) {
        console.error(`Error handling key input: ${error}`);
      }

      if (choice !== prevChoice) {
        this.btns[prevChoice].setTexture(TEXTURE.CHOICE);
        this.btns[choice].setTexture(TEXTURE.CHOICE_S);
      }
    });
  }

  update(time: number, delta: number): void {}

  private exitUi(choice: number) {
    this.btns[choice].setTexture(TEXTURE.CHOICE);
    this.clean();
    this.pause(true);
  }
}
