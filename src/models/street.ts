import { GameObject, gameObjectFactory } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface Street extends GameObject {
  objectType: "Street";
}

export const isStreet = (unknownObject: any): unknownObject is Street => {
  if (!unknownObject) return false;
  return (unknownObject as Street).objectType === "Street";
};

export const streetFactory = (attributes: Partial<Street>): Unsaved<Street> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Street" as "Street",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
