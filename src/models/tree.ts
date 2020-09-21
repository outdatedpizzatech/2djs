import { GRID_INTERVAL } from "../common";
import { Positionable } from "../types";
import { Debuggable } from "../debug";

export interface Tree extends Debuggable, Positionable {
  objectType: "Tree";
}

export const isTree = (unknownObject: any): unknownObject is Tree => {
  return (unknownObject as Tree).objectType === "Tree";
};

export const treeFactory = (attributes: Partial<Tree>): Tree => {
  return {
    objectType: "Tree",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
  };
};
