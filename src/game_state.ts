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
  camera: Camera;
  fieldRenderables: GameObject[];
  layerMaps: LayerMaps;
  myPlayer: Player | null;
  players: Player[];
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const { layerMaps, myPlayer } = gameState;

  if (!myPlayer) {
    return [direction, gameState];
  }

  const { x, y } = myPlayer;

  const [xMod, yMod] = getModsFromDirection(direction);

  let modifiedMap = addToCoordinateMap(
    x + xMod,
    y + yMod,
    layerMaps.interactableMap,
    myPlayer
  );
  modifiedMap = removeFromCoordinateMap(x, y, modifiedMap);

  gameState.layerMaps.interactableMap = modifiedMap;

  return [direction, gameState];
};
