import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export interface Water extends Debuggable, GameObject {
  objectType: "Water";
}

export const isWater = (unknownObject: any): unknownObject is Water => {
  if (!unknownObject) return false;
  return (unknownObject as Water).objectType === "Water";
};

export const waterFactory = (
  attributes: Partial<Water> & { _id: string }
): Water => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Water" as "Water",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
