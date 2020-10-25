import { GameObject, gameObjectFactory, scalableFactory } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface HouseWallShort extends GameObject {
  objectType: "HouseWallShort";
}

export const isHouseWallShort = (
  unknownObject: any
): unknownObject is HouseWallShort => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWallShort).objectType === "HouseWallShort";
};

export const houseWallShortFactory = (
  attributes: Partial<HouseWallShort>
): Unsaved<HouseWallShort> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWallShort" as "HouseWallShort",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
