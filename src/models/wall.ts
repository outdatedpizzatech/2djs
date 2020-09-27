import { Layer, Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Wall extends Debuggable, Placeable {
  objectType: "Wall";
}

export const isWall = (unknownObject: any): unknownObject is Wall => {
  if (!unknownObject) return false;
  return (unknownObject as Wall).objectType === "Wall";
};

export const wallFactory = (attributes: Partial<Wall>): Wall => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Wall" as "Wall",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.INTERACTION,
  };

  return { ...positionableProperties, ...particularProperties };
};
