import { Player } from "./player";
import { Camera } from "./camera";
import { Tree } from "./tree";
import { Direction } from "./direction";
import { Positionable } from "./types";
import { getModsFromDirection } from "./direction";

export interface CoordinateMap {
  [key: number]:
    | {
        [key: number]: Positionable | undefined;
      }
    | undefined;
}

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
  trees: Tree[];
  coordinateMap: CoordinateMap;
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
) => {
  const { coordinateMap, player } = gameState;
  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  const xRowAdd = coordinateMap[x + xMod] || {};
  xRowAdd[y + yMod] = player;
  coordinateMap[x + xMod] = xRowAdd;

  const xRowRemove = coordinateMap[x] || {};
  delete xRowRemove[y];
  coordinateMap[x] = xRowRemove;

  player.x = x + xMod;
  player.y = y + yMod;

  gameState.coordinateMap = coordinateMap;
  gameState.player = player;

  return gameState;
};
