import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { Placeable, Positionable } from "./types";
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
  layerMaps: {
    interactableMap: CoordinateMap<Placeable>;
    groundMap: CoordinateMap<Placeable>;
    overheadMap: CoordinateMap<Placeable>;
  };
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const { layerMaps, player } = gameState;
  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  let modifiedMap = addToCoordinateMap(
    x + xMod,
    y + yMod,
    layerMaps.interactableMap,
    player
  );
  modifiedMap = removeFromCoordinateMap(x, y, modifiedMap);

  gameState.layerMaps.interactableMap = modifiedMap;

  return [direction, gameState];
};
