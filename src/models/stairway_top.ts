import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface StairwayTop extends GameObject {
  objectType: "StairwayTop";
}

export const isStairwayTop = (
  unknownObject: any
): unknownObject is StairwayTop => {
  if (!unknownObject) return false;
  return (unknownObject as StairwayTop).objectType === "StairwayTop";
};

export const stairwayTopFactory = (
  attributes: Partial<StairwayTop>
): Unsaved<StairwayTop> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "StairwayTop" as "StairwayTop",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
