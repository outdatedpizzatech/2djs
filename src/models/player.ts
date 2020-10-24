import { Direction } from "../direction";
import { v4 as uuidv4 } from "uuid";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";
import axios from "axios";
import {
  API_URI_BASE,
  GRID_INTERVAL,
  SPAWN_COORDINATE,
  UNIT_BASE,
} from "../common";

export interface Player extends GameObject {
  objectType: "Player";
  moving: boolean;
  movementQueue: Direction[];
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

export const playerFactory = (
  attributes: Partial<Player> & { _id: string }
): Player => {
  const positionableProperties = positionableFactory(attributes);

  const particularProperties = {
    _id: attributes._id,
    objectType: "Player" as "Player",
    facingDirection: attributes.facingDirection || Direction.DOWN,
    movementSpeed: attributes.movementSpeed || 80 * (GRID_INTERVAL / UNIT_BASE),
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    moving: false,
    clientId: attributes.clientId || uuidv4(),
    movementQueue: new Array<Direction>(),
  };

  return { ...positionableProperties, ...particularProperties };
};

export const getAnimationFrames = (targetPlayer: Player): number[] | null => {
  const movementDirection = targetPlayer.movementQueue[0];

  if (movementDirection == null) {
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
