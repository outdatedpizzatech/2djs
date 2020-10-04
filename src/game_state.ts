import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import {
  addToCoordinateMap,
  LayerMaps,
  removeFromCoordinateMap,
} from "./coordinate_map";
import { cloneDeep } from "lodash";
import { GameObject } from "./game_object";

export interface GameState {
  camera: Camera;
  fieldRenderables: GameObject[];
  layerMaps: LayerMaps;
  myClientId: string;
  players: { [key: string]: Player | undefined };
}

export const updateCoordinateMap = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, player, direction } = params;

  const { layerMaps } = gameState;

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

  return gameState;
};
