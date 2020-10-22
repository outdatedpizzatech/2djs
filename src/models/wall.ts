import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface Wall extends GameObject {
  objectType: "Wall";
}

export const isWall = (unknownObject: any): unknownObject is Wall => {
  if (!unknownObject) return false;
  return (unknownObject as Wall).objectType === "Wall";
};

export const wallFactory = (attributes: Partial<Wall>): Unsaved<Wall> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Wall" as "Wall",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
