import { GameObject, Layer } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Door extends Debuggable, GameObject {
  objectType: "Door";
}

export const isDoor = (unknownObject: any): unknownObject is Door => {
  if (!unknownObject) return false;
  return (unknownObject as Door).objectType === "Door";
};

export const doorFactory = (attributes: Partial<Door>): Door => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Door" as "Door",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.PASSIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
