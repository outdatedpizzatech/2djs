import { GRID_INTERVAL } from "../common";
import { Positionable } from "../types";
import { Debuggable } from "../debug";
import { Direction } from "../direction";

export interface Player extends Positionable, Debuggable {
  objectType: "Player";
  movementDirection: Direction;
  facingDirection: Direction;
  movementSpeed: number;
  debug: {
    color?: string;
  };
}

export const isPlayer = (unknownObject: any): unknownObject is Player => {
  return (unknownObject as Player).objectType === "Player";
};

export const walkingDownAnimation = [0, 1];
export const walkingUpAnimation = [2, 3];
export const walkingLeftAnimation = [4, 5];
export const walkingRightAnimation = [6, 7];

export const playerFactory = (attributes: Partial<Player>): Player => {
  return {
    objectType: "Player",
    x: attributes.x || 0,
    y: attributes.y || 0,
    movementDirection: attributes.movementDirection || Direction.NONE,
    facingDirection: attributes.facingDirection || Direction.DOWN,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    movementSpeed: attributes.movementSpeed || 80,
    debug: {
      color: attributes.debug?.color,
    },
  };
};

export const getAnimationFrames = (targetPlayer: Player): number[] | null => {
  const movementDirection = targetPlayer.movementDirection;

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

  return animation;
};
