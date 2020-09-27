import { Placeable } from "../types";
import { Debuggable } from "../debug";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Tree extends Debuggable, Placeable {
  objectType: "Tree";
}

export const isTree = (unknownObject: any): unknownObject is Tree => {
  if (!unknownObject) return false;
  return (unknownObject as Tree).objectType === "Tree";
};

export const treeFactory = (attributes: Partial<Tree>): Tree => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Tree" as "Tree",
    debug: {
      color: attributes.debug?.color,
    },
    passable: false,
  };

  return { ...positionableProperties, ...particularProperties };
};
