import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { GameObject } from "./types";
import {
  addToCoordinateMap,
  LayerMaps,
  removeFromCoordinateMap,
} from "./coordinate_map";

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
  fieldRenderables: GameObject[];
  layerMaps: LayerMaps;
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
