import { Layer, Unsaved } from "../types";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";

export interface Empty extends GameObject {
  objectType: "Empty";
}

export const isEmpty = (unknownObject: any): unknownObject is Empty => {
  if (!unknownObject) return false;
  return (unknownObject as Empty).objectType === "Empty";
};

export const emptyFactory = (attributes: Partial<Empty>): Unsaved<Empty> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Empty" as "Empty",
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
