import { Debuggable } from "../debug/grid_lines";
import { Direction } from "../direction";
import { v4 as uuidv4 } from "uuid";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";
import axios from "axios";
import { API_URI_BASE, SPAWN_COORDINATE } from "../common";

export interface Player extends Debuggable, GameObject {
  objectType: "Player";
  movementDirection: Direction;
  moving: boolean;
  facingDirection: Direction;
  movementSpeed: number;
  clientId: string;
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
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    moving: false,
    clientId: attributes.clientId || uuidv4(),
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

export const playerOnSpawnPoint = async () => {
  const result = await axios.get(`${API_URI_BASE}/players`);
  return result.data.find(
    (player: any) =>
      isPlayer(player) &&
      SPAWN_COORDINATE.x == player.x &&
      SPAWN_COORDINATE.y == player.y
  );
};
