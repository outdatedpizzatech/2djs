import { Layer, Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { Direction } from "../direction";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Player extends Placeable, Debuggable {
  objectType: "Player";
  movementDirection: Direction;
  facingDirection: Direction;
  movementSpeed: number;
}

export const isPlayer = (unknownObject: any): unknownObject is Player => {
  if (!unknownObject) return false;
  return (unknownObject as Player).objectType === "Player";
};

export const walkingDownAnimation = [0, 1];
export const walkingUpAnimation = [2, 3];
export const walkingLeftAnimation = [4, 5];
export const walkingRightAnimation = [6, 7];

export const playerFactory = (attributes: Partial<Player>): Player => {
  const positionableProperties = positionableFactory(attributes);

  const particularProperties = {
    objectType: "Player" as "Player",
    movementDirection: attributes.movementDirection || Direction.NONE,
    facingDirection: attributes.facingDirection || Direction.DOWN,
    movementSpeed: attributes.movementSpeed || 80,
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.INTERACTION,
  };

  return { ...positionableProperties, ...particularProperties };
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
