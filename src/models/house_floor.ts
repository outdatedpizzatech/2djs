import { Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface HouseFloor extends Debuggable, Placeable {
  objectType: "HouseFloor";
}

export const isHouseFloor = (
  unknownObject: any
): unknownObject is HouseFloor => {
  if (!unknownObject) return false;
  return (unknownObject as HouseFloor).objectType === "HouseFloor";
};

export const houseFloorFactory = (
  attributes: Partial<HouseFloor>
): HouseFloor => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "HouseFloor" as "HouseFloor",
    debug: {
      color: attributes.debug?.color,
    },
    passable: true,
  };

  return { ...positionableProperties, ...particularProperties };
};
