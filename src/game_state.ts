import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { setAtPath, LayerMaps, removeAtPath } from "./coordinate_map";
import { GameObject } from "./game_object";

export interface GameState {
  camera: Camera;
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
  const {
    layerMaps: { interactableMap },
  } = gameState;

  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  setAtPath(
    gameState.layerMaps.interactableMap,
    x + xMod,
    y + yMod,
    player
  );
  removeAtPath(interactableMap, x, y);

  return gameState;
};
