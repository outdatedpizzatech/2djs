import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";
import sprites from "../sprite_collections/house_wall_frame_short_sprite_collection";

export interface HouseWallFrameShort extends GameObject {
  objectType: "HouseWallFrameShort";
}

export const isHouseWallFrameShort = (
  unknownObject: any
): unknownObject is HouseWallFrameShort => {
  if (!unknownObject) return false;
  return (
    (unknownObject as HouseWallFrameShort).objectType === "HouseWallFrameShort"
  );
};

export const houseWallFrameShortFactory = (
  attributes: Partial<HouseWallFrameShort>
): Unsaved<HouseWallFrameShort> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseWallFrameShort" as "HouseWallFrameShort",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    isStructure: true,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
