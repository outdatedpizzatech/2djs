import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface Water extends GameObject {
  objectType: "Water";
}

export const isWater = (unknownObject: any): unknownObject is Water => {
  if (!unknownObject) return false;
  return (unknownObject as Water).objectType === "Water";
};

export const waterFactory = (attributes: Partial<Water>): Unsaved<Water> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Water" as "Water",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
