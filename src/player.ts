import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import { Camera } from "./camera";
import SpriteSheet from "./player_spritesheet.png";

const movementSpeed = 1;

const walkingDownAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
const walkingUpAnimation = [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3];
const walkingLeftAnimation = [4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5];
const walkingRightAnimation = [6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7];

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
  private animationIndex: number = -1;
  private currentAnimation: number[] = [];
  private facingDirection: Direction = Direction.DOWN;

  constructor(attributes: PlayerAttributes) {
    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = CAMERA_WIDTH;
    canvas.height = CAMERA_HEIGHT;

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

    var img = new Image();
    img.src = SpriteSheet;

    ctx.save();

    this._handleAnimation();

    const frameIndex = this._getSpriteFrame();

    ctx.beginPath();
    ctx.rect(this.renderX + x, this.renderY + y, GRID_INTERVAL, GRID_INTERVAL);
    ctx.clip();

    ctx.drawImage(
      img,
      this.renderX + x - frameIndex * GRID_INTERVAL,
      this.renderY + y
    );
  }

  moveBy(movementDirection: Direction) {
    if (!this.tweenDirection) {
      this.facingDirection = movementDirection;
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

  private _handleAnimation() {
    if (this.tweenDirection == Direction.DOWN) {
      this.currentAnimation = walkingDownAnimation;
    } else if (this.tweenDirection == Direction.UP) {
      this.currentAnimation = walkingUpAnimation;
    } else if (this.tweenDirection == Direction.RIGHT) {
      this.currentAnimation = walkingRightAnimation;
    } else if (this.tweenDirection == Direction.LEFT) {
      this.currentAnimation = walkingLeftAnimation;
    } else {
      this.currentAnimation = null;
    }

    if (this.currentAnimation) {
      this.animationIndex++;
      if (this.currentAnimation.length <= this.animationIndex) {
        this.animationIndex = 0;
      }
    } else {
      this.animationIndex = -1;
    }
  }

  private _getSpriteFrame(): number {
    if (this.currentAnimation) {
      return this.currentAnimation[this.animationIndex];
    }

    if (this.facingDirection == Direction.DOWN) {
      return 0;
    } else if (this.facingDirection == Direction.UP) {
      return 2;
    } else if (this.facingDirection == Direction.LEFT) {
      return 4;
    } else if (this.facingDirection == Direction.RIGHT) {
      return 6;
    }

    return 0;
  }
}
