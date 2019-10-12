import GameScene from '../main';
import Building from './building';
import * as short from 'short-uuid';
import { Body, Vector } from '../types/matter';
import { GameObjects } from 'phaser';
const uuid = short();
class Unit extends Phaser.GameObjects.GameObject {
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private static FILL_COLOR = 0xffffff;

  constructor(scene: GameScene, x: number, y: number, target?: Building) {
    super(scene, 'unit');
    this._rectangle = scene.add.rectangle(x, y, 10, 10, Unit.FILL_COLOR) as any;
    scene.physics.add.existing(this._rectangle);
    this._target = target;
    const targetPosition = this._target._rectangle.getCenter();
    const currentPosition = this._rectangle.getCenter();
    const distance = targetPosition.subtract(currentPosition);
    this._rectangle.body.setVelocity(distance.x, distance.y);
  }

  //public update() {}
}

export default Unit;
