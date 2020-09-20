import { GRID_INTERVAL } from "../common";
import { Positionable, Renderable } from "../types";
import { Debuggable } from "../debug";
import { addView } from "../renderers/canvas_renderer";

export interface Tree
  extends Debuggable,
    Positionable,
    Renderable<HTMLCanvasElement> {
  objectType: "Tree";
}

export const isTree = (unknownObject: any): unknownObject is Tree => {
  return (unknownObject as Tree).objectType === "Tree";
};

export const treeFactory = (attributes: Partial<Tree>): Tree => {
  const view = addView();

  return {
    objectType: "Tree",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    view,
    debug: {
      color: attributes.debug?.color,
    },
  };
};
