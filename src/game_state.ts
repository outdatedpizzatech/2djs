import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { Positionable } from "./types";

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
  fieldRenderables: any[];
  coordinateMap: CoordinateMap;
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const { coordinateMap, player } = gameState;
  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  const xRowAdd = coordinateMap[x + xMod] || {};
  xRowAdd[y + yMod] = player;
  coordinateMap[x + xMod] = xRowAdd;

  const xRowRemove = coordinateMap[x] || {};
  delete xRowRemove[y];
  coordinateMap[x] = xRowRemove;

  gameState.coordinateMap = coordinateMap;

  return [direction, gameState];
};
