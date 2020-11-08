import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface Stairway extends GameObject {
  objectType: "Stairway";
}

export const isStairway = (unknownObject: any): unknownObject is Stairway => {
  if (!unknownObject) return false;
  return (unknownObject as Stairway).objectType === "Stairway";
};

export const stairwayFactory = (
  attributes: Partial<Stairway>
): Unsaved<Stairway> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Stairway" as "Stairway",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
