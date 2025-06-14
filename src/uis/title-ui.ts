import i18next from 'i18next';
import { DEPTH } from '../enums/depth';
import { TEXTURE } from '../enums/texture';
import { InGameScene } from '../scenes/ingame-scene';
import { addBackground, addText, addWindow, runFadeEffect, Ui } from './ui';
import { TEXTSTYLE } from '../enums/textstyle';
import { KEY } from '../enums/key';
import { PlayerInfo } from '../storage/player-info';
import { KeyboardHandler } from '../handlers/keyboard-handler';
import { logoutApi } from '../api';
import { eventBus } from '../core/event-bus';
import { EVENT } from '../enums/event';
import { MODE } from '../enums/mode';

export class TitleUi extends Ui {
  private container!: Phaser.GameObjects.Container;
  private windowContainer!: Phaser.GameObjects.Container;

  private bg!: Phaser.GameObjects.Image;
  private windows: Phaser.GameObjects.NineSlice[] = [];
  private texts: Phaser.GameObjects.Text[] = [];
  private continueName!: Phaser.GameObjects.Text;
  private continueLocation!: Phaser.GameObjects.Text;
  private continuePlaytime!: Phaser.GameObjects.Text;
  private continueParties: Phaser.GameObjects.Image[] = [];

  private readonly contentHeight: number = 100;
  private readonly contentSpacing: number = 15;
  private readonly scale: number = 3.4;
  private readonly menus = [i18next.t('menu:newgame'), i18next.t('menu:mysteryGift'), i18next.t('menu:logout')];

  constructor(scene: InGameScene) {
    super(scene);
  }

  setup(): void {
    const width = this.getWidth();
    const height = this.getHeight();

    this.container = this.createContainer(width / 2, height / 2);

    this.bg = addBackground(this.scene, TEXTURE.BG_LOBBY).setOrigin(0.5, 0.5);

    this.windowContainer = this.createContainer(width / 2, height / 2 + 160);

    this.createContinue();
    this.createMenus();

    this.container.add(this.bg);

    this.container.setVisible(false);
    this.container.setDepth(DEPTH.TITLE - 1);
    this.container.setScrollFactor(0);

    this.windowContainer.setVisible(false);
    this.windowContainer.setDepth(DEPTH.TITLE);
    this.windowContainer.setScrollFactor(0);
  }

  show(data?: any): void {
    runFadeEffect(this.scene, 1000, 'in');

    const playerData = PlayerInfo.getInstance();

    this.continueName.setText(playerData.getNickname());
    this.continueLocation.setText(i18next.t(`menu:overworld_${playerData.getLocation()}`));

    this.container.setVisible(true);
    this.windowContainer.setVisible(true);

    this.handleKeyInput();
  }

  clean(data?: any): void {
    this.container.setVisible(false);
    this.windowContainer.setVisible(false);
  }

  pause(onoff: boolean, data?: any): void {}

  handleKeyInput(data?: any): void {
    const keys = [KEY.UP, KEY.DOWN, KEY.SELECT];
    const keyboard = KeyboardHandler.getInstance();

    let choice = 0;

    this.windows[choice].setTexture(TEXTURE.WINDOW_4);

    keyboard.setAllowKey(keys);
    keyboard.setKeyDownCallback(async (key) => {
      let prevChoice = choice;
      eventBus.emit(EVENT.PLAY_SOUND, this.scene, key);

      try {
        switch (key) {
          case KEY.UP:
            if (choice > 0) {
              choice--;
            }
            break;
          case KEY.DOWN:
            if (choice < this.windows.length - 1) {
              choice++;
            }
            break;
          case KEY.SELECT:
            if (choice === 0) {
              eventBus.emit(EVENT.CHANGE_MODE, MODE.OVERWORLD_CONNECTING, PlayerInfo.getInstance().getLocation());
            } else if (choice === 1) {
              eventBus.emit(EVENT.CHANGE_MODE, MODE.ACCOUNT_DELETE);
            } else if (choice === 2) {
              console.log('이상한 소포');
            } else if (choice === 3) {
              const result = await logoutApi();
              if (result) {
                eventBus.emit(EVENT.CHANGE_MODE, MODE.LOGIN);
              }
            }
            this.windows[choice].setTexture(TEXTURE.WINDOW_5);
            break;
        }

        if (key === KEY.UP || key === KEY.DOWN) {
          if (choice !== prevChoice) {
            this.windows[prevChoice].setTexture(TEXTURE.WINDOW_5);
            this.windows[choice].setTexture(TEXTURE.WINDOW_4);
          }
        }
      } catch (error) {
        console.error(`Error handling key input: ${error}`);
      }
    });
  }

  update(time: number, delta: number): void {}

  private block() {}

  private unblock() {}

  private createContinue() {
    const window = addWindow(this.scene, TEXTURE.WINDOW_5, 0, -195, 210, 75, 16, 16, 16, 16).setScale(this.scale);
    const text = addText(this.scene, -320, -275, i18next.t('menu:continue'), TEXTSTYLE.DEFAULT_BLACK).setOrigin(0, 0.5);
    const labelName = addText(this.scene, -320, -230, i18next.t('menu:continueName'), TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);
    const labelLocation = addText(this.scene, -320, -190, i18next.t('menu:continueLocation'), TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);
    const labelPlaytime = addText(this.scene, -320, -150, i18next.t('menu:continuePlaytime'), TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);

    this.continueName = addText(this.scene, -60, -230, '', TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);
    this.continueLocation = addText(this.scene, -60, -190, '', TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);
    this.continuePlaytime = addText(this.scene, -60, -150, '00:00', TEXTSTYLE.SPECIAL).setOrigin(0, 0.5);

    this.windowContainer.add(window);
    this.windowContainer.add(text);
    this.windowContainer.add(labelName);
    this.windowContainer.add(labelLocation);
    this.windowContainer.add(labelPlaytime);
    this.windowContainer.add(this.continueName);
    this.windowContainer.add(this.continueLocation);
    this.windowContainer.add(this.continuePlaytime);

    this.windows.unshift(window);
  }

  private createMenus() {
    let currentY = 0;

    for (const target of this.menus) {
      const window = addWindow(this.scene, TEXTURE.WINDOW_5, 0, currentY, 210, 30, 16, 16, 16, 16).setScale(this.scale);
      const text = addText(this.scene, -320, currentY, target, TEXTSTYLE.DEFAULT_BLACK).setOrigin(0, 0.5);

      this.windows.push(window);
      this.texts.push(text);

      this.windowContainer.add(window);
      this.windowContainer.add(text);

      currentY += this.contentHeight + this.contentSpacing;
    }
  }
}
