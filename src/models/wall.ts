import { GRID_INTERVAL } from "../common";
import { Positionable, Renderable } from "../types";
import { Debuggable } from "../debug";
import { addView } from "../renderers/canvas_renderer";

export interface Wall
  extends Debuggable,
    Positionable,
    Renderable<HTMLCanvasElement> {
  objectType: "Wall";
}

export const isWall = (unknownObject: any): unknownObject is Wall => {
  return (unknownObject as Wall).objectType === "Wall";
};

export const wallFactory = (attributes: Partial<Wall>): Wall => {
  const view = addView();

  return {
    objectType: "Wall",
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
