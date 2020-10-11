import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export interface Roof extends Debuggable, GameObject {
  objectType: "Roof";
}

export const isRoof = (unknownObject: any): unknownObject is Roof => {
  if (!unknownObject) return false;
  return (unknownObject as Roof).objectType === "Roof";
};

export const roofFactory = (
  attributes: Partial<Roof> & { _id: string }
): Roof => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Roof" as "Roof",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
