import { Camera } from "./camera";
import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import SpriteSheet from "./player_spritesheet.png";
import { Player } from "./player";

const dilate = (timeline: number[], count: number) => {
  return timeline.reduce((accumulator, currentValue) => {
    const stretched = new Array(count).fill(currentValue);
    return accumulator.concat(stretched);
  }, []);
};

const dilationBaseline = 6;
const walkingDownAnimation = [0, 1];
const walkingUpAnimation = [2, 3];
const walkingLeftAnimation = [4, 5];
const walkingRightAnimation = [6, 7];

export class PlayerRenderer {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _player: Player;
  private readonly _color: string;
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

    ctx.save();

    const currentAnimation = this._decideCurrentAnimation();
    this._animationIndex = this._advanceAnimation(
      currentAnimation,
      this._animationIndex
    );
    const frameIndex = this._getSpriteFrame(
      currentAnimation,
      this._animationIndex
    );

    ctx.beginPath();
    ctx.rect(
      this._player.positionX() + x,
      this._player.positionY() + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
    ctx.clip();

    var img = new Image();
    img.src = SpriteSheet;

    ctx.drawImage(
      img,
      this._player.positionX() + x - frameIndex * GRID_INTERVAL,
      this._player.positionY() + y
    );
  }

  private _decideCurrentAnimation(): number[] {
    const movementDirection = this._player.movementDirection();

    if (movementDirection == Direction.NONE) {
      return null;
    }

    let animation: number[];

    if (movementDirection == Direction.DOWN) {
      animation = walkingDownAnimation;
    } else if (movementDirection == Direction.UP) {
      animation = walkingUpAnimation;
    } else if (movementDirection == Direction.RIGHT) {
      animation = walkingRightAnimation;
    } else if (movementDirection == Direction.LEFT) {
      animation = walkingLeftAnimation;
    } else {
      animation = walkingDownAnimation;
    }

    return dilate(animation, dilationBaseline / this._player.movementSpeed());
  }

  private _advanceAnimation(
    currentAnimation: number[],
    animationIndex: number
  ): number {
    if (currentAnimation) {
      const nextAnimationIndex = animationIndex + 1;

      if (currentAnimation.length <= nextAnimationIndex) {
        return 0;
      } else {
        return nextAnimationIndex;
      }
    } else {
      return -1;
    }
  }

  private _getSpriteFrame(
    currentAnimation: number[],
    animationIndex: number
  ): number {
    if (currentAnimation) {
      return currentAnimation[animationIndex];
    }

    const facingDirection = this._player.facingDirection();

    if (facingDirection == Direction.DOWN) {
      return 0;
    } else if (facingDirection == Direction.UP) {
      return 2;
    } else if (facingDirection == Direction.LEFT) {
      return 4;
    } else if (facingDirection == Direction.RIGHT) {
      return 6;
    }

    return 0;
  }
}
