import { GRID_INTERVAL } from "../../common";
import { Positionable } from "../../types";

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
