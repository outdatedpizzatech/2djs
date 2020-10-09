import { GameObject, Placeable } from "./game_object";

export interface CoordinateMap<T> {
  [key: number]:
    | {
        [key: number]: T | undefined;
      }
    | undefined;
}

export interface LayerMark {
  interaction: boolean;
  ground: boolean;
  passive: boolean;
  overhead: boolean;
}

export type LayerMarkKey = keyof LayerMark;

export interface LayerMaps {
  interactableMap: CoordinateMap<GameObject>;
  groundMap: CoordinateMap<GameObject>;
  passiveMap: CoordinateMap<GameObject>;
  overheadMap: CoordinateMap<GameObject>;
}

export const getAtPath = <T>(
  map: CoordinateMap<T>,
  x: number,
  y: number
): T | null => {
  const xRow = map[x];
  if (xRow) {
    return xRow[y] || null;
  }

  return null;
};

export const setAtPath = <T>(
  map: CoordinateMap<T>,
  x: number,
  y: number,
  value: T
): void => {
  const xRow = map[x] || {};
  xRow[y] = value;
  map[x] = xRow;
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
