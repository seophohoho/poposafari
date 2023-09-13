import { Direction } from "./Direction";
import { GameScene } from "./main";

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2
  ) {
    const offsetX = GameScene.TILE_SIZE/2;
    const offsetY = GameScene.TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY
    );
    this.sprite.setFrame(0);
  }
  //sprite의 픽셀 위치를 반환한다.
  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }
  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }
  stopAnimation(direction: Direction, isPlayerMovementFinish:boolean,isPlayerPressAnyMovementKey: boolean) {
    const tempString = direction.split('_',2);
    const animationManager = this.sprite.anims.animationManager;
    this.sprite.setFrame(animationManager.get(direction).frames[1].frame.name);
    //player run logic should add.
    if(!isPlayerPressAnyMovementKey && isPlayerMovementFinish && direction.charAt(0) === 'r'){
      this.sprite.setFrame(animationManager.get(`walk_${tempString[1]}_1`).frames[1].frame.name);
    }
    this.sprite.anims.stop();
  }
  startAnimation(direction: Direction) {
    this.sprite.anims.play(direction);
  }                      
  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }
  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }
}
