import { GameObject, gameObjectFactory, scalableFactory } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface HouseRoofSteeple extends GameObject {
  objectType: "HouseRoofSteeple";
}

export const isHouseRoofSteeple = (
  unknownObject: any
): unknownObject is HouseRoofSteeple => {
  if (!unknownObject) return false;
  return (unknownObject as HouseRoofSteeple).objectType === "HouseRoofSteeple";
};

export const houseRoofSteepleFactory = (
  attributes: Partial<HouseRoofSteeple>
): Unsaved<HouseRoofSteeple> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseRoofSteeple" as "HouseRoofSteeple",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
