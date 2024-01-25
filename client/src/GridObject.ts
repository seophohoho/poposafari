import * as Phaser from "phaser";
import { Direction } from "./Direction";
import { OverworldScene } from "./OverworldScene";

export class GridObject{
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2
  ) {
    const offsetX = OverworldScene.TILE_SIZE/2;
    const offsetY = OverworldScene.TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * OverworldScene.TILE_SIZE + offsetX,
      tilePos.y * OverworldScene.TILE_SIZE + offsetY
    );
    this.sprite.setFrame(0);
  }
  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }
  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }
  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }
  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }
  standStopAnimation(direction: Direction){
    const tempString = direction.split('_',3);
    const animationManager = this.sprite.anims.animationManager;
    this.sprite.setFrame(animationManager.get(`player_walk_${tempString[2]}_1`).frames[1].frame.name);
    this.sprite.anims.stop();
  }
  stopAnimation(direction: Direction){
    const animationManager = this.sprite.anims.animationManager;
    this.sprite.setFrame(animationManager.get(direction).frames[1].frame.name);
    //player run logic should add.
    this.sprite.anims.stop();
  }
  startAnimation(direction: Direction){
    this.sprite.anims.play(direction);
  }
  setHide(type: boolean){
    if(type){this.sprite.setVisible(false)}
    else{this.sprite.setVisible(true)}
  }
}