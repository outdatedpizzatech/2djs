import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface HouseWall extends GameObject {
  objectType: "HouseWall";
}

export const isHouseWall = (unknownObject: any): unknownObject is HouseWall => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWall).objectType === "HouseWall";
};

export const houseWallFactory = (
  attributes: Partial<HouseWall>
): Unsaved<HouseWall> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWall" as "HouseWall",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
