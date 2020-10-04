import { Coordinate } from "./coordinate";
import { GRID_INTERVAL } from "./common";

export interface Positionable extends Coordinate {
  worldX: number;
  worldY: number;
}

export const positionableFactory = (
  attributes: Partial<Positionable>
): Positionable => {
  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
  };
};
