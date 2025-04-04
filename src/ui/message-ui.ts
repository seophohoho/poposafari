import i18next from 'i18next';
import { ANIMATION } from '../enums/animation';
import { DEPTH } from '../enums/depth';
import { KEY } from '../enums/key';
import { TEXTSTYLE } from '../enums/textstyle';
import { TEXTURE } from '../enums/texture';
import { KeyboardManager } from '../managers';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { addImage, addText, addWindow, createSprite, getTextStyle, Ui } from './ui';
import { Message } from '../interface/sys';

export class MessageUi extends Ui {
  private mode!: OverworldMode;
  private messageContainer!: Phaser.GameObjects.Container;
  private messageText!: Phaser.GameObjects.Text;
  private messageWindow!: Phaser.GameObjects.NineSlice;
  private questionWindow!: Phaser.GameObjects.NineSlice;
  private endMark!: Phaser.GameObjects.Sprite;
  private questionContainer!: Phaser.GameObjects.Container;
  private questionTexts: Phaser.GameObjects.Text[] = [];
  private questionDummys: Phaser.GameObjects.Image[] = [];
  private selectedIndex: number = 0;

  constructor(scene: InGameScene, mode?: OverworldMode) {
    super(scene);

    if (mode) {
      this.mode = mode;
    }
  }

  setup(): void {
    const width = this.scene.game.canvas.width;
    const height = this.scene.game.canvas.height;

    this.messageContainer = this.scene.add.container(width / 2, height / 2);
    this.messageWindow = addWindow(this.scene, TEXTURE.WINDOW_1, 0, 210, 800, 100, 8, 8, 8, 8);
    this.messageText = addText(this.scene, -380, 180, '', TEXTSTYLE.MESSAGE_BLACK).setOrigin(0, 0);
    this.messageContainer.add(this.messageWindow);
    this.messageContainer.add(this.messageText);
    this.messageContainer.setVisible(false);

    this.endMark = createSprite(this.scene, TEXTURE.PAUSE_BLACK, +350, 220);
    this.endMark.setDepth(DEPTH.MESSAGE).setScale(1.5).setVisible(false);
    this.messageContainer.add(this.endMark);

    this.questionContainer = this.scene.add.container(width / 2 + 685, height / 2 + 230);
    this.questionWindow = addWindow(this.scene, TEXTURE.WINDOW_1, 0, 0, 150, 100, 8, 8, 8, 8);
    this.questionContainer.add(this.questionWindow);

    const options = [i18next.t('menu:accept'), i18next.t('menu:reject')];
    options.forEach((text, index) => {
      const yPosition = index * 40 - 20;
      const optionText = addText(this.scene, -30, yPosition, text, TEXTSTYLE.MESSAGE_BLACK).setOrigin(0, 0.5);
      const dummy = addImage(this.scene, TEXTURE.BLANK, -50, yPosition);

      this.questionTexts.push(optionText);
      this.questionDummys.push(dummy);
      this.questionContainer.add(optionText);
      this.questionContainer.add(dummy);
    });
    this.questionContainer.setDepth(DEPTH.MESSAGE).setScale(1.5);
    this.questionContainer.setScrollFactor(0);
    this.questionContainer.setVisible(false);

    this.messageContainer.setDepth(DEPTH.MESSAGE).setScale(2);
    this.messageContainer.setScrollFactor(0);
  }

  async show(data: Message): Promise<boolean | void> {
    const text = data.content;
    let textArray = text.split('');
    let index = 0;
    let isQuestion = data.format === 'question';
    let type = data.type;
    let isFinish = false;

    this.endMark.setVisible(false);
    this.messageContainer.setVisible(true);
    this.messageText.text = '';
    this.questionContainer.setVisible(false);

    if (type === 'sys') {
      this.messageWindow.setTexture(TEXTURE.WINDOW_0);
      this.endMark.setTexture(TEXTURE.PAUSE_WHITE);
      this.messageText.setStyle(getTextStyle(TEXTSTYLE.MESSAGE_WHITE));
      this.messageText.setPosition(-380, 180);
      this.questionWindow.setTexture(TEXTURE.WINDOW_0);
      this.questionTexts[0].setStyle(getTextStyle(TEXTSTYLE.MESSAGE_WHITE));
      this.questionTexts[1].setStyle(getTextStyle(TEXTSTYLE.MESSAGE_WHITE));
      this.questionDummys[0].setTexture(TEXTURE.ARROW_W_R);
      this.questionDummys[1].setTexture(TEXTURE.BLANK);
    } else if (type === 'battle') {
      this.messageWindow.setTexture(TEXTURE.BLANK);
      this.endMark.setTexture(TEXTURE.PAUSE_WHITE);
      this.messageText.setStyle(getTextStyle(TEXTSTYLE.BATTLE_MESSAGE));
      this.messageText.setPosition(-460, 190);
    } else {
      this.messageWindow.setTexture(TEXTURE.WINDOW_1);
      this.endMark.setTexture(TEXTURE.PAUSE_BLACK);
      this.messageText.setStyle(getTextStyle(TEXTSTYLE.MESSAGE_BLACK));
      this.messageText.setPosition(-380, 180);
      this.questionWindow.setTexture(TEXTURE.WINDOW_1);
      this.questionTexts[0].setStyle(getTextStyle(TEXTSTYLE.MESSAGE_BLACK));
      this.questionTexts[1].setStyle(getTextStyle(TEXTSTYLE.MESSAGE_BLACK));
      this.questionDummys[0].setTexture(TEXTURE.ARROW_B_R);
      this.questionDummys[1].setTexture(TEXTURE.BLANK);
    }

    const keyboardManager = KeyboardManager.getInstance();
    keyboardManager.setAllowKey([KEY.SELECT]);
    keyboardManager.clearCallbacks();

    return new Promise((resolve) => {
      const addNextChar = () => {
        if (index < textArray.length) {
          this.messageText.text += textArray[index];
          index++;
          this.scene.time.delayedCall(10, addNextChar, [], this);
        } else if (!isFinish) {
          isFinish = true;
          if (type !== 'battle') this.endMark.setVisible(!isQuestion);
          if (!isQuestion) {
            this.endMark.anims.play(type === 'sys' || type === 'battle' ? ANIMATION.PAUSE_WHITE : ANIMATION.PAUSE_BLACK);
            keyboardManager.setKeyDownCallback((key) => {
              if (key === KEY.SELECT) {
                this.clean();
                resolve();
              }
            });
          } else {
            this.showQuestion(resolve, type);
          }
        }
      };

      addNextChar();
    });
  }

  private showQuestion(resolve: (value: boolean) => void, type: 'sys' | 'default' | 'battle'): void {
    this.questionContainer.setVisible(true);

    const keyboardManager = KeyboardManager.getInstance();
    const keys = [KEY.UP, KEY.DOWN, KEY.SELECT];

    keyboardManager.setAllowKey(keys);
    keyboardManager.setKeyDownCallback((key) => {
      const prevIndex = this.selectedIndex;

      switch (key) {
        case KEY.UP:
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
          break;
        case KEY.DOWN:
          this.selectedIndex = Math.min(this.questionTexts.length - 1, this.selectedIndex + 1);
          break;
        case KEY.SELECT:
          this.clean();
          resolve(this.selectedIndex === 0 ? true : false);
          this.selectedIndex = 0;
          break;
      }

      if (this.selectedIndex !== prevIndex) {
        this.updateSelection(prevIndex, this.selectedIndex, type);
      }
    });
  }

  private updateSelection(prevIndex: number, currentIndex: number, type: 'sys' | 'default' | 'battle'): void {
    this.questionDummys[prevIndex].setTexture(TEXTURE.BLANK);

    if (type === 'sys') this.questionDummys[currentIndex].setTexture(TEXTURE.ARROW_W_R);
    if (type === 'default') this.questionDummys[currentIndex].setTexture(TEXTURE.ARROW_B_R);
  }

  clean(): void {
    this.messageText.text = '';
    this.messageContainer.setVisible(false);
    this.questionContainer.setVisible(false);
  }

  pause(onoff: boolean): void {
    this.endMark.anims.stop();
  }

  update(time: number, delta: number): void {}
}
