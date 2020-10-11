import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export interface HouseFloor extends Debuggable, GameObject {
  objectType: "HouseFloor";
}

export const isHouseFloor = (
  unknownObject: any
): unknownObject is HouseFloor => {
  if (!unknownObject) return false;
  return (unknownObject as HouseFloor).objectType === "HouseFloor";
};

export const houseFloorFactory = (
  attributes: Partial<HouseFloor> & { _id: string }
): HouseFloor => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    _id: attributes._id,
    objectType: "HouseFloor" as "HouseFloor",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.GROUND,
    groupId: attributes.groupId,
  };

  return { ...positionableProperties, ...particularProperties };
};
