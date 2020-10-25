import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface Roof extends GameObject {
  objectType: "Roof";
}

export const isRoof = (unknownObject: any): unknownObject is Roof => {
  if (!unknownObject) return false;
  return (unknownObject as Roof).objectType === "Roof";
};

export const roofFactory = (attributes: Partial<Roof>): Unsaved<Roof> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Roof" as "Roof",
    layer: Layer.OVERHEAD,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
