import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface HouseRoofEdge extends GameObject {
  objectType: "HouseRoofEdge";
}

export const isHouseRoofEdge = (
  unknownObject: any
): unknownObject is HouseRoofEdge => {
  if (!unknownObject) return false;
  return (unknownObject as HouseRoofEdge).objectType === "HouseRoofEdge";
};

export const houseRoofEdgeFactory = (
  attributes: Partial<HouseRoofEdge>
): Unsaved<HouseRoofEdge> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseRoofEdge" as "HouseRoofEdge",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    isStructure: true,
  };

  return {
    ...gameObjectProperties,
    ...particularProperties,
  };
};
