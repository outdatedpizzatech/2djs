import { GRID_INTERVAL } from "../common";
import { Placeable } from "../types";
import { Debuggable } from "../debug";

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
  return {
    objectType: "HouseFloor",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
    passable: true,
  };
};
