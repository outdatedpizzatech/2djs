import { Layer, Unsaved } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";

export interface Empty extends Debuggable, GameObject {
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
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
