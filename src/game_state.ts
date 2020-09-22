import { Player } from "./models/player";
import { Camera } from "./camera";
import { Direction, getModsFromDirection } from "./direction";
import { Positionable } from "./types";

export interface CoordinateMap<T> {
  [key: number]:
    | {
        [key: number]: T | undefined;
      }
    | undefined;
}

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
  fieldRenderables: any[];
  coordinateMap: CoordinateMap<Positionable>;
}

export const updateCoordinateMap = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const { coordinateMap, player } = gameState;
  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  let modifiedMap = addToCoordinateMap(
    x + xMod,
    y + yMod,
    coordinateMap,
    player
  );
  modifiedMap = removeFromCoordinateMap(x, y, modifiedMap);

  gameState.coordinateMap = modifiedMap;

  return [direction, gameState];
};

export function addToCoordinateMap<T>(
  x: number,
  y: number,
  coordinateMap: CoordinateMap<T>,
  newObject: T
): CoordinateMap<T> {
  const xRowAdd = coordinateMap[x] || {};
  xRowAdd[y] = newObject;
  coordinateMap[x] = xRowAdd;
  return coordinateMap;
}

export function removeFromCoordinateMap<T>(
  x: number,
  y: number,
  coordinateMap: CoordinateMap<T>
): CoordinateMap<T> {
  const xRowRemove = coordinateMap[x] || {};
  delete xRowRemove[y];
  coordinateMap[x] = xRowRemove;
  return coordinateMap;
}

export function getFromCoordinateMap<T>(
  x: number,
  y: number,
  coordinateMap: CoordinateMap<T>
): T | undefined {
  const xRow = coordinateMap[x] || {};
  return xRow[y];
}
