import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface Roof extends GameObject {
  objectType: "Roof";
}

export const isRoof = (unknownObject: any): unknownObject is Roof => {
  if (!unknownObject) return false;
  return (unknownObject as Roof).objectType === "Roof";
};

export const roofFactory = (attributes: Partial<Roof>): Unsaved<Roof> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Roof" as "Roof",
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
