import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
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
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWall" as "HouseWall",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
