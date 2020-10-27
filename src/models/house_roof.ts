import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface HouseRoof extends GameObject {
  objectType: "HouseRoof";
}

export const isHouseRoof = (unknownObject: any): unknownObject is HouseRoof => {
  if (!unknownObject) return false;
  return (unknownObject as HouseRoof).objectType === "HouseRoof";
};

export const houseRoofFactory = (
  attributes: Partial<HouseRoof>
): Unsaved<HouseRoof> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseRoof" as "HouseRoof",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
