import { Placeable } from "./types";

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
  interactableMap: CoordinateMap<Placeable>;
  groundMap: CoordinateMap<Placeable>;
  passiveMap: CoordinateMap<Placeable>;
  overheadMap: CoordinateMap<Placeable>;
}

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
