import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import { Camera } from "./camera";
import SpriteSheet from "./player_spritesheet.png";

export interface Player {
  color: string;
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  movementDirection: Direction;
  facingDirection: Direction;
  positionX: number;
  positionY: number;
  animationIndex: number;
  movementSpeed: number;
}

export const playerFactory = (attributes: Partial<Player>): Player => {
  const canvas = _addCanvas();

  return {
    color: attributes.color || "red",
    x: attributes.x || 0,
    y: attributes.y || 0,
    movementDirection: attributes.movementDirection || Direction.NONE,
    facingDirection: attributes.facingDirection || Direction.DOWN,
    positionX: attributes.x || 0,
    positionY: attributes.y || 0,
    movementSpeed: attributes.movementSpeed || 1,
    animationIndex: 0,
    canvas,
  };
};

export const renderPlayer = (targetPlayer: Player, camera: Camera) => {
  const ctx = targetPlayer.canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.restore();

  const { x, y } = camera.offset();
  ctx.clearRect(0, 0, targetPlayer.canvas.width, targetPlayer.canvas.height);
  ctx.fillStyle = targetPlayer.color;
  ctx.fillRect(
    targetPlayer.positionX + x,
    targetPlayer.positionY + y,
    GRID_INTERVAL,
    GRID_INTERVAL
  );

  ctx.save();

  const currentAnimation = decideCurrentAnimation(targetPlayer);
  const animationIndex = nextAnimationFrame(
    currentAnimation,
    targetPlayer.animationIndex
  );
  const frameIndex = _getSpriteFrame(
    targetPlayer.facingDirection,
    currentAnimation,
    animationIndex
  );

  ctx.beginPath();
  ctx.rect(
    targetPlayer.positionX + x,
    targetPlayer.positionY + y,
    GRID_INTERVAL,
    GRID_INTERVAL
  );
  ctx.clip();

  const img = new Image();
  img.src = SpriteSheet;

  ctx.drawImage(
    img,
    targetPlayer.positionX + x - frameIndex * GRID_INTERVAL,
    targetPlayer.positionY + y
  );
};

export const nextAnimationFrame = (
  currentAnimation: number[] | null,
  animationIndex: number
): number => {
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
};

const _addCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.style.zIndex = "2";
  canvas.style.position = "absolute";
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  return canvas;
};

function _getSpriteFrame(
  facingDirection: Direction,
  currentAnimation: number[] | null,
  animationIndex: number
): number {
  if (currentAnimation) {
    return currentAnimation[animationIndex];
  }

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

export const decideCurrentAnimation = (
  targetPlayer: Player
): number[] | null => {
  const walkingDownAnimation = [0, 1];
  const walkingUpAnimation = [2, 3];
  const walkingLeftAnimation = [4, 5];
  const walkingRightAnimation = [6, 7];
  const dilationBaseline = 6;

  const movementDirection = targetPlayer.movementDirection;

  const dilate = (timeline: number[], count: number) => {
    return timeline.reduce((accumulator, currentValue) => {
      const stretched = new Array(count).fill(currentValue);
      return accumulator.concat(stretched);
    }, [] as number[]);
  };

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

  return dilate(animation, dilationBaseline / targetPlayer.movementSpeed);
};
