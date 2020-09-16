import { Camera } from "./camera";
import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import SpriteSheet from "./player_spritesheet.png";
import { Player } from "./player";

const walkingDownAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
const walkingUpAnimation = [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3];
const walkingLeftAnimation = [4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5];
const walkingRightAnimation = [6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7];

export class PlayerRenderer {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _player: Player;
  private readonly _color: string;

  private _currentAnimation: number[] = null;
  private _animationIndex: number;

  constructor(player: Player, color: string) {
    this._player = player;
    this._color = color;

    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = CAMERA_WIDTH;
    canvas.height = CAMERA_HEIGHT;

    this._canvas = canvas;
  }

  view(): HTMLCanvasElement {
    return this._canvas;
  }

  render(camera: Camera) {
    const ctx = this._canvas.getContext("2d");
    ctx.restore();

    const { x, y } = camera.offset();
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.fillStyle = this._color;
    ctx.fillRect(
      this._player.positionX() + x,
      this._player.positionY() + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );

    var img = new Image();
    img.src = SpriteSheet;

    ctx.save();

    this._handleAnimation();

    const frameIndex = this._getSpriteFrame();

    ctx.beginPath();
    ctx.rect(
      this._player.positionX() + x,
      this._player.positionY() + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
    ctx.clip();

    ctx.drawImage(
      img,
      this._player.positionX() + x - frameIndex * GRID_INTERVAL,
      this._player.positionY() + y
    );
  }

  private _handleAnimation() {
    if (this._player.movementDirection() == Direction.DOWN) {
      this._currentAnimation = walkingDownAnimation;
    } else if (this._player.movementDirection() == Direction.UP) {
      this._currentAnimation = walkingUpAnimation;
    } else if (this._player.movementDirection() == Direction.RIGHT) {
      this._currentAnimation = walkingRightAnimation;
    } else if (this._player.movementDirection() == Direction.LEFT) {
      this._currentAnimation = walkingLeftAnimation;
    } else {
      this._currentAnimation = null;
    }

    if (this._currentAnimation) {
      this._animationIndex++;
      if (this._currentAnimation.length <= this._animationIndex) {
        this._animationIndex = 0;
      }
    } else {
      this._animationIndex = -1;
    }
  }

  private _getSpriteFrame(): number {
    if (this._currentAnimation) {
      return this._currentAnimation[this._animationIndex];
    }

    if (this._player.facingDirection() == Direction.DOWN) {
      return 0;
    } else if (this._player.facingDirection() == Direction.UP) {
      return 2;
    } else if (this._player.facingDirection() == Direction.LEFT) {
      return 4;
    } else if (this._player.facingDirection() == Direction.RIGHT) {
      return 6;
    }

    return 0;
  }
}
