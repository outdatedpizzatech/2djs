import { GRID_INTERVAL } from "../common";
import { Placeable } from "../types";
import { Debuggable } from "../debug";

export interface Water extends Debuggable, Placeable {
  objectType: "Water";
}

export const isWater = (unknownObject: any): unknownObject is Water => {
  if (!unknownObject) return false;
  return (unknownObject as Water).objectType === "Water";
};

export const waterFactory = (attributes: Partial<Water>): Water => {
  return {
    objectType: "Water",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
    passable: false,
  };
};
