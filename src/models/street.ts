import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface Street extends Debuggable, GameObject {
  objectType: "Street";
}

export const isStreet = (unknownObject: any): unknownObject is Street => {
  if (!unknownObject) return false;
  return (unknownObject as Street).objectType === "Street";
};

export const streetFactory = (attributes: Partial<Street>): Unsaved<Street> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Street" as "Street",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
