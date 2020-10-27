import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface HouseFloor extends GameObject {
  objectType: "HouseFloor";
}

export const isHouseFloor = (
  unknownObject: any
): unknownObject is HouseFloor => {
  if (!unknownObject) return false;
  return (unknownObject as HouseFloor).objectType === "HouseFloor";
};

export const houseFloorFactory = (
  attributes: Partial<HouseFloor>
): Unsaved<HouseFloor> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseFloor" as "HouseFloor",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
