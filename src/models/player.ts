import { GRID_INTERVAL } from "../common";
import { Positionable, Renderable } from "../types";
import { Debuggable } from "../debug";
import { Direction } from "../direction";
import { addView } from "../renderers/canvas_renderer";

export interface Player
  extends Positionable,
    Debuggable,
    Renderable<HTMLCanvasElement> {
  objectType: "Player";
  movementDirection: Direction;
  facingDirection: Direction;
  animationIndex: number;
  movementSpeed: number;
  debug: {
    color?: string;
  };
}

export const playerFactory = (attributes: Partial<Player>): Player => {
  const view = addView();

  return {
    objectType: "Player",
    x: attributes.x || 0,
    y: attributes.y || 0,
    movementDirection: attributes.movementDirection || Direction.NONE,
    facingDirection: attributes.facingDirection || Direction.DOWN,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    movementSpeed: attributes.movementSpeed || 1,
    animationIndex: 0,
    view,
    debug: {
      color: attributes.debug?.color,
    },
  };
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

export const getAnimationFrames = (targetPlayer: Player): number[] | null => {
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
