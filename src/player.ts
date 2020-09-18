import { Direction, GRID_INTERVAL } from "./common";
import { PlayerRenderer } from "./player_renderer";
import { Camera } from "./camera";

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

  constructor(attributes: PlayerAttributes) {
    this.positionX = attributes.x;
    this.positionY = attributes.y;
    this._renderer = new PlayerRenderer(this, attributes.color);
  }

  view(): HTMLCanvasElement {
    return this._renderer.view();
  }

  render(camera: Camera): void {
    this._renderer.render(camera);
  }
}
