import { Direction } from "./common";
import { PlayerRenderer } from "./player_renderer";

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
  icon: string;
}

export class Player {
  public positionX: number;
  public positionY: number;
  private _renderer: PlayerRenderer;
  public movementDirection: Direction = Direction.NONE;
  public facingDirection: Direction = Direction.DOWN;
  public movementSpeed: number = 1;
  public canvas: HTMLCanvasElement;
  public color: string;
  public animationIndex: number;

  constructor(attributes: PlayerAttributes) {
    this.positionX = attributes.x;
    this.positionY = attributes.y;
    this._renderer = new PlayerRenderer(this, attributes.color);
    this.color = attributes.color;
  }

  view(): HTMLCanvasElement {
    return this._renderer.view();
  }
}
