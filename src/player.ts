import { Direction, GRID_INTERVAL } from "./common";
import { Camera } from "./camera";

const movementSpeed = 5;

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
}

export class Player {
  public renderX: number;
  public renderY: number;

  private canvas: HTMLCanvasElement;
  private color: string;
  private tweenDirection: Direction = Direction.NONE;

  constructor(attributes: PlayerAttributes) {
    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = 800;
    canvas.height = 600;

    this.canvas = canvas;
    this.color = attributes.color;
    this.renderX = attributes.x;
    this.renderY = attributes.y;
  }

  view(): HTMLCanvasElement {
    return this.canvas;
  }

  render(camera: Camera) {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.renderX + camera.offset().x,
      this.renderY + camera.offset().y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  moveBy(movementDirection: Direction) {
    if (!this.tweenDirection) {
      this.tweenDirection = movementDirection;
    }
  }

  refreshMovement() {
    if (!this.tweenDirection) {
      return;
    }

    if (this.tweenDirection == Direction.UP) {
      this.renderY -= movementSpeed;

      if (this.renderY % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.RIGHT) {
      this.renderX += movementSpeed;

      if (this.renderX % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.DOWN) {
      this.renderY += movementSpeed;

      if (this.renderY % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.LEFT) {
      this.renderX -= movementSpeed;

      if (this.renderX % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }
  }
}
