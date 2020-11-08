import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface StairwayRailingBottomRight extends GameObject {
  objectType: "StairwayRailingBottomRight";
}

export const isStairwayRailingBottomRight = (
  unknownObject: any
): unknownObject is StairwayRailingBottomRight => {
  if (!unknownObject) return false;
  return (
    (unknownObject as StairwayRailingBottomRight).objectType ===
    "StairwayRailingBottomRight"
  );
};

export const stairwayRailingBottomRightFactory = (
  attributes: Partial<StairwayRailingBottomRight>
): Unsaved<StairwayRailingBottomRight> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "StairwayRailingBottomRight" as "StairwayRailingBottomRight",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
