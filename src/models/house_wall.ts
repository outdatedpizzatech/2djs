import { GRID_INTERVAL } from "../common";
import { Placeable } from "../types";
import { Debuggable } from "../debug";

export interface HouseWall extends Debuggable, Placeable {
  objectType: "HouseWall";
}

export const isHouseWall = (unknownObject: any): unknownObject is HouseWall => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWall).objectType === "HouseWall";
};

export const houseWallFactory = (attributes: Partial<HouseWall>): HouseWall => {
  return {
    objectType: "HouseWall",
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    debug: {
      color: attributes.debug?.color,
    },
    passable: false,
  };
};
