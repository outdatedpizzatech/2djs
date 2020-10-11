import { Layer } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";

export interface Door extends Debuggable, GameObject {
  objectType: "Door";
}

export const isDoor = (unknownObject: any): unknownObject is Door => {
  if (!unknownObject) return false;
  return (unknownObject as Door).objectType === "Door";
};

export const doorFactory = (
  attributes: Partial<Door> & { _id: string }
): Door => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "Door" as "Door",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.PASSIVE,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
