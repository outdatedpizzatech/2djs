import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface StairwayRailingBottomLeft extends GameObject {
  objectType: "StairwayRailingBottomLeft";
}

export const isStairwayRailingBottomLeft = (
  unknownObject: any
): unknownObject is StairwayRailingBottomLeft => {
  if (!unknownObject) return false;
  return (
    (unknownObject as StairwayRailingBottomLeft).objectType ===
    "StairwayRailingBottomLeft"
  );
};

export const stairwayRailingBottomLeftFactory = (
  attributes: Partial<StairwayRailingBottomLeft>
): Unsaved<StairwayRailingBottomLeft> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "StairwayRailingBottomLeft" as "StairwayRailingBottomLeft",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
