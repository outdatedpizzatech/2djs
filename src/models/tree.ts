import { GameObject, gameObjectFactory } from "../game_object";
import { Layer, Unsaved } from "../types";

export interface Tree extends GameObject {
  objectType: "Tree";
}

export const isTree = (unknownObject: any): unknownObject is Tree => {
  if (!unknownObject) return false;
  return (unknownObject as Tree).objectType === "Tree";
};

export const treeFactory = (attributes: Partial<Tree>): Unsaved<Tree> => {
  const gameObjectProperties = gameObjectFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Tree" as "Tree",
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
