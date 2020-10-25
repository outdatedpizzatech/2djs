import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer, Unsaved } from "../types";

export interface HouseWallFrame extends GameObject {
  objectType: "HouseWallFrame";
}

export const isHouseWallFrame = (
  unknownObject: any
): unknownObject is HouseWallFrame => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWallFrame).objectType === "HouseWallFrame";
};

export const houseWallFrameFactory = (
  attributes: Partial<HouseWallFrame>
): Unsaved<HouseWallFrame> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWallFrame" as "HouseWallFrame",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
