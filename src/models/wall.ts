import { GRID_INTERVAL } from "../common";
import { Positionable } from "../types";
import { Debuggable } from "../debug";

export interface Wall extends Debuggable, Positionable {
  objectType: "Wall";
}

export const isWall = (unknownObject: any): unknownObject is Wall => {
  return (unknownObject as Wall).objectType === "Wall";
};

export const wallFactory = (attributes: Partial<Wall>): Wall => {
  return {
    objectType: "Wall",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
  };
};
