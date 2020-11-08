import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface StairwayBottom extends GameObject {
  objectType: "StairwayBottom";
}

export const isStairwayBottom = (
  unknownObject: any
): unknownObject is StairwayBottom => {
  if (!unknownObject) return false;
  return (unknownObject as StairwayBottom).objectType === "StairwayBottom";
};

export const stairwayBottomFactory = (
  attributes: Partial<StairwayBottom>
): Unsaved<StairwayBottom> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "StairwayBottom" as "StairwayBottom",
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
