import { Layer, Unsaved } from "../types";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";

export interface Door extends GameObject {
  objectType: "Door";
}

export const isDoor = (unknownObject: any): unknownObject is Door => {
  if (!unknownObject) return false;
  return (unknownObject as Door).objectType === "Door";
};

export const doorFactory = (attributes: Partial<Door>): Unsaved<Door> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Door" as "Door",
    layer: Layer.PASSIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
