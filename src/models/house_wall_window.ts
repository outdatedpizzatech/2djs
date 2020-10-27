import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface HouseWallWindow extends GameObject {
  objectType: "HouseWallWindow";
}

export const isHouseWallWindow = (
  unknownObject: any
): unknownObject is HouseWallWindow => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWallWindow).objectType === "HouseWallWindow";
};

export const houseWallWindowFactory = (
  attributes: Partial<HouseWallWindow>
): Unsaved<HouseWallWindow> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWallWindow" as "HouseWallWindow",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
