import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export interface Tree extends Debuggable, GameObject {
  objectType: "Tree";
}

export const isTree = (unknownObject: any): unknownObject is Tree => {
  if (!unknownObject) return false;
  return (unknownObject as Tree).objectType === "Tree";
};

export const treeFactory = (attributes: Partial<Tree>): Omit<Tree, "_id"> => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Tree" as "Tree",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
