import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export interface Wall extends Debuggable, GameObject {
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
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
