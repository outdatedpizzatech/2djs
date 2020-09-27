import { GameObject, Layer } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Empty extends Debuggable, GameObject {
  objectType: "Empty";
}

export const isEmpty = (unknownObject: any): unknownObject is Empty => {
  if (!unknownObject) return false;
  return (unknownObject as Empty).objectType === "Empty";
};

export const emptyFactory = (attributes: Partial<Empty>): Empty => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Empty" as "Empty",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
