import { Direction, GRID_INTERVAL } from "./common";
import { Camera } from "./camera";

const movementSpeed = 5;

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
  icon: string;
}

export class Player {
  public renderX: number;
  public renderY: number;

  private canvas: HTMLCanvasElement;
  private color: string;
  private tweenDirection: Direction = Direction.NONE;
  private icon: string;

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
    this.icon = attributes.icon;
  }

  view(): HTMLCanvasElement {
    return this.canvas;
  }

  render(camera: Camera) {
    const ctx = this.canvas.getContext("2d");
    ctx.restore();

    const { x, y } = camera.offset();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.renderX + x,
      this.renderY + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );

    var img = new Image(); // Create new img element
    img.src =
      "data:image/png;base64,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";

    ctx.save();

    ctx.beginPath();
    ctx.rect(this.renderX + x, this.renderY + y, GRID_INTERVAL, GRID_INTERVAL);
    ctx.clip();

    if (this.icon === "star") {
      ctx.drawImage(img, this.renderX + x, this.renderY + y);
    } else {
      ctx.drawImage(img, this.renderX + x - 50, this.renderY + y);
    }
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
