import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface Flower extends GameObject {
  objectType: "Flower";
}

export const isFlower = (unknownObject: any): unknownObject is Flower => {
  if (!unknownObject) return false;
  return (unknownObject as Flower).objectType === "Flower";
};

export const flowerFactory = (attributes: Partial<Flower>): Unsaved<Flower> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Flower" as "Flower",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
