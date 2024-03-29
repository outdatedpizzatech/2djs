import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";
import sprites from "../sprite_collections/house_wall_frame_sprite_collection";

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
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWallFrame" as "HouseWallFrame",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    isStructure: true,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
