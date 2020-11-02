import { Layer, Unsaved } from "../types";
import { GameObject, gameObjectFactory } from "../game_object";

export interface Door extends GameObject {
  objectType: "Door";
  warpTo?: {
    mapId: string;
    x: number;
    y: number;
  }
}

export const isDoor = (unknownObject: any): unknownObject is Door => {
  if (!unknownObject) return false;
  return (unknownObject as Door).objectType === "Door";
};

export const doorFactory = (attributes: Partial<Door>): Unsaved<Door> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Door" as "Door",
    layer: Layer.PASSIVE,
    groupId: attributes.groupId,
    warpTo: attributes.warpTo,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
