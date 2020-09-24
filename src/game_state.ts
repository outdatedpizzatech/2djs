import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { Positionable } from "./types";
import {
  addToCoordinateMap,
  CoordinateMap,
  removeFromCoordinateMap,
} from "./coordinate_map";

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
  fieldRenderables: any[];
  collisionMap: CoordinateMap<Positionable>;
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const { collisionMap, player } = gameState;
  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  let modifiedMap = addToCoordinateMap(
    x + xMod,
    y + yMod,
    collisionMap,
    player
  );
  modifiedMap = removeFromCoordinateMap(x, y, modifiedMap);

  gameState.collisionMap = modifiedMap;

  return [direction, gameState];
};
