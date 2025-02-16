import { MODE } from './enums/mode';
import { Account, Message } from './interface/sys';
import { MessageManager, ModeManager, PlayerPokemonManager } from './managers';
import { Mode } from './mode';
import { InGameScene } from './scenes/ingame-scene';
import { LoginUi } from './ui/login-ui';
import { NewGameUi } from './ui/newgame-ui';
import { RegisterUi } from './ui/register-ui';
import { TitleUi } from './ui/title-ui';
import { BagUi } from './ui/bag-ui';
import { BoxUi } from './ui/box-ui';
import { BoxChoiceUi } from './ui/box-choice-ui';
import { BoxRegisterUi } from './ui/box-register-ui';
import { SeasonUi } from './ui/season-ui';
import { OverworldUi } from './ui/overworld-ui';
import { OverworldMenuUi } from './ui/overworld-menu-ui';
import { Overworld000 } from './ui/overworld-000';
import { OVERWORLD_TYPE } from './enums/overworld-type';
import { Overworld011 } from './ui/overworld-011';
import { Bag } from './storage/bag';
import { BagChoiceUi } from './ui/bag-choice-ui';
import { BagRegisterUi } from './ui/bag-register-ui';
import { OverworldItemSlotUi } from './ui/overworld-itemslot-ui';
import { Location, PlayerInfo } from './storage/player-info';
import { OverworldHUDUi } from './ui/overworld-hud-ui';
import { SafariListUi } from './ui/safari-list-ui';
import { ShopListUi } from './ui/shop-list-ui.ts';
import { ShopChoiceUi } from './ui/shop-choice-ui';
import { OverworldInfo } from './storage/overworld-info';
import { BattleUi } from './ui/battle-ui';

export class NoneMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {}

  enter(): void {
    //TODO: 분기점을 언젠가는 넣어야 한다. 로그인이 되어 있는 상태면, TITLE 모드로 변경되어야하고, 아니라면, LOGIN 모드로 변경되어야 한다.
    this.manager.changeMode(MODE.OVERWORLD);
  }
  exit(): void {}

  update(): void {}
}

export class LoginMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new LoginUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }
  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeRegisterMode() {
    this.manager.changeMode(MODE.REGISTER);
  }

  submit(data: Account): void {
    console.log('login submit');
  }
}

export class RegisterMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new RegisterUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }

  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeLoginMode() {
    this.manager.changeMode(MODE.LOGIN);
  }

  submit(data: Account): void {
    console.log('register submit');
  }
}

export class TitleMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new TitleUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    //user data load.

    this.ui.show();
  }

  exit(): void {
    this.ui.clean();
  }
  update(): void {}

  changeLoginMode() {
    this.manager.changeMode(MODE.LOGIN);
  }
}

export class NewGameMode extends Mode {
  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);
  }

  init(): void {
    this.ui = new NewGameUi(this.scene, this);
    this.ui.setup();
  }

  enter(): void {
    this.ui.show();
  }
  update(): void {}

  exit(): void {}
}

export class OverworldMode extends Mode {
  private bag: Bag;
  private playerInfo: PlayerInfo;
  private overworldInfo: OverworldInfo;
  private playerPokemonManager!: PlayerPokemonManager;
  private currentOverworldUisIndex!: number;

  constructor(scene: InGameScene, manager: ModeManager) {
    super(scene, manager);

    this.bag = new Bag();
    this.playerInfo = new PlayerInfo();
    this.overworldInfo = new OverworldInfo();
  }

  init(): void {
    this.uis.push(new Overworld000(this.scene, this, OVERWORLD_TYPE.PLAZA));
    this.uis.push(new Overworld011(this.scene, this, OVERWORLD_TYPE.SAFARI));
    this.uis.push(new SeasonUi(this.scene, this));
    this.uis.push(new OverworldHUDUi(this.scene, this));
    this.uis.push(new OverworldMenuUi(this.scene, this));
    this.uis.push(new OverworldItemSlotUi(this.scene, this));
    this.uis.push(new SafariListUi(this.scene, this));
    this.uis.push(new BagUi(this.scene, this));
    this.uis.push(new BagChoiceUi(this.scene, this));
    this.uis.push(new BagRegisterUi(this.scene, this));
    this.uis.push(new BoxUi(this.scene, this));
    this.uis.push(new BoxChoiceUi(this.scene, this));
    this.uis.push(new BoxRegisterUi(this.scene, this));
    this.uis.push(new ShopListUi(this.scene, this));
    this.uis.push(new ShopChoiceUi(this.scene, this));
    this.uis.push(new BattleUi(this.scene, this));

    for (const ui of this.uis) {
      ui.setup();
    }

    this.bag.setup();
    this.playerInfo.setup();
  }

  enter(data?: any): void {
    this.playerPokemonManager = PlayerPokemonManager.getInstance();

    this.addUiStackOverlap('OverworldHUDUi', data);
    this.addUiStackOverlap('Overworld000', data);

    this.currentOverworldUisIndex = 1;
  }

  exit(): void {
    for (const ui of this.uiStack) {
      ui.clean();
    }
    this.cleanUiStack();
  }

  update(time: number, delta: number): void {
    const overworld = this.uiStack[this.currentOverworldUisIndex];
    overworld.update(time, delta);

    //TODO: 적절한 제어? overworldHUDUi가 들어올 경우, update가 실행되버린다.
  }

  getBag() {
    if (!this.bag) {
      console.error('Bag object does not exist.');
      return;
    }

    return this.bag;
  }

  getPlayerInfo() {
    if (!this.playerInfo) {
      console.error('Player does not exist.');
      return;
    }

    return this.playerInfo;
  }

  getOverworldInfo() {
    if (!this.overworldInfo) {
      console.error('Overworld Info does not exist.');
      return;
    }

    return this.overworldInfo;
  }

  updateOverworldInfoUi() {
    const ui = this.getUiType('OverworldHUDUi');
    if (ui instanceof OverworldHUDUi) {
      ui.updateOverworldInfoUi();
    }
  }

  updateOverworldLocationUi(location: Location) {
    const ui = this.getUiType('OverworldHUDUi');
    if (ui instanceof OverworldHUDUi) {
      ui.updateOverworldLocationUi(location);
    }
  }

  updateOverworld(key: string) {
    const overworld = this.getUiStackTop() as OverworldUi;

    overworld.clean();
    this.popUiStack();

    this.addUiStackOverlap(`Overworld${key}`);
  }

  changeTitleMode() {
    this.manager.changeMode(MODE.TITLE);
  }

  moveToVillage() {
    this.getUiStackTop().clean();
    this.popUiStack();
    this.addUiStackOverlap(`Overworld000`, { x: 7, y: 8 });
  }

  async startMessage(data: Message[]) {
    const overworld = this.getUiStackTop();

    this.pauseOverworldSystem(true);

    const message = MessageManager.getInstance();
    const ret = await message.show(overworld, data);

    this.pauseOverworldSystem(false);

    return ret;
  }

  pauseOverworldSystem(onoff: boolean) {
    const overworldHUDUi = this.getUiType('OverworldHUDUi');
    const overworld = this.getUiStackTop() as OverworldUi;

    if (overworldHUDUi && overworld) {
      overworldHUDUi.pause(onoff ? true : false);
      overworld.pause(onoff ? true : false);
    }
  }
}
