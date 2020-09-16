import { Direction, GRID_INTERVAL } from "./common";
import { PlayerRenderer } from "./player_renderer";
import { Camera } from "./camera";

const movementSpeed = 1;

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
  icon: string;
}

export class Player {
  private _positionX: number;
  private _positionY: number;
  private _renderer: PlayerRenderer;
  private _movementDirection: Direction = Direction.NONE;
  private _facingDirection: Direction = Direction.DOWN;

  constructor(attributes: PlayerAttributes) {
    this._positionX = attributes.x;
    this._positionY = attributes.y;
    this._renderer = new PlayerRenderer(this, attributes.color);
  }

  positionX(): number {
    return this._positionX;
  }

  positionY(): number {
    return this._positionY;
  }

  view(): HTMLCanvasElement {
    return this._renderer.view();
  }

  render(camera: Camera): void {
    this._renderer.render(camera);
  }

  movementDirection(): Direction {
    return this._movementDirection;
  }

  facingDirection(): Direction {
    return this._facingDirection;
  }

  moveBy(movementDirection: Direction): void {
    if (!this._movementDirection) {
      this._facingDirection = movementDirection;
      this._movementDirection = movementDirection;
    }
  }

  refreshMovement(): void {
    if (!this._movementDirection) {
      return;
    }

    if (this._movementDirection == Direction.UP) {
      this._positionY -= movementSpeed;

      if (this._positionY % GRID_INTERVAL === 0) {
        this._movementDirection = Direction.NONE;
      }
    }

    if (this._movementDirection == Direction.RIGHT) {
      this._positionX += movementSpeed;

      if (this._positionX % GRID_INTERVAL === 0) {
        this._movementDirection = Direction.NONE;
      }
    }

    if (this._movementDirection == Direction.DOWN) {
      this._positionY += movementSpeed;

      if (this._positionY % GRID_INTERVAL === 0) {
        this._movementDirection = Direction.NONE;
      }
    }

    if (this._movementDirection == Direction.LEFT) {
      this._positionX -= movementSpeed;

      if (this._positionX % GRID_INTERVAL === 0) {
        this._movementDirection = Direction.NONE;
      }
    }
  }
}
