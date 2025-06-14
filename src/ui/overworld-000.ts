import { DEPTH } from '../enums/depth';
import { OVERWORLD_TYPE } from '../enums/overworld-type';
import { TEXTURE } from '../enums/texture';
import { OverworldMode } from '../modes';
import { InGameScene } from '../scenes/ingame-scene';
import { Plaza } from './plaza';

export class Overworld000 extends Plaza {
  constructor(scene: InGameScene, mode: OverworldMode, type: OVERWORLD_TYPE) {
    super(scene, mode, '000');
  }

  setup(): void {
    super.setup();

    this.map.setup(TEXTURE.OVERWORLD_000, [TEXTURE.TILE_FLOOR, TEXTURE.TILE_OBJECT]);
    this.map.setLayer(0, TEXTURE.TILE_FLOOR, DEPTH.GROUND);
    this.map.setLayer(1, TEXTURE.TILE_OBJECT, DEPTH.GROUND + 1);
    this.map.setForegroundLayer(2, [TEXTURE.TILE_FLOOR, TEXTURE.TILE_OBJECT], DEPTH.FOREGROND);

    this.npc.setup(`npc001`, 11, 8, OVERWORLD_TYPE.PLAZA, 'talk');
    this.npc.setup(`npc002`, 14, 8, OVERWORLD_TYPE.PLAZA, 'talk');
    this.npc.setup(`npc000`, 8, 8, OVERWORLD_TYPE.PLAZA, 'talk');

    // this.setupPlayerInitPos(2, 2);
  }

  show(): void {
    super.show();
  }

  clean(): void {
    super.clean();
  }
}
