import { GRID_INTERVAL } from "../common";
import { Placeable } from "../types";
import { Debuggable } from "../debug";

export interface Street extends Debuggable, Placeable {
  objectType: "Street";
}

export const isStreet = (unknownObject: any): unknownObject is Street => {
  if (!unknownObject) return false;
  return (unknownObject as Street).objectType === "Street";
};

export const streetFactory = (attributes: Partial<Street>): Street => {
  return {
    objectType: "Street",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
    passable: true,
  };
};
