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
  interactiveMap: CoordinateMap<GameObject>;
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

export function removeAtPath<T>(
  coordinateMap: CoordinateMap<T>,
  x: number,
  y: number
): CoordinateMap<T> {
  const xRowRemove = coordinateMap[x] || {};
  delete xRowRemove[y];
  coordinateMap[x] = xRowRemove;
  return coordinateMap;
}
