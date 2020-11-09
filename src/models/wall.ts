import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";
import sprites from "../sprite_collections/wall_sprite_collection";

export interface Wall extends GameObject {
  objectType: "Wall";
}

export const isWall = (unknownObject: any): unknownObject is Wall => {
  if (!unknownObject) return false;
  return (unknownObject as Wall).objectType === "Wall";
};

export const wallFactory = (attributes: Partial<Wall>): Unsaved<Wall> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Wall" as "Wall",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    isStructure: true,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
