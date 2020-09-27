import { Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface HouseWall extends Debuggable, Placeable {
  objectType: "HouseWall";
}

export const isHouseWall = (unknownObject: any): unknownObject is HouseWall => {
  if (!unknownObject) return false;
  return (unknownObject as HouseWall).objectType === "HouseWall";
};

export const houseWallFactory = (attributes: Partial<HouseWall>): HouseWall => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "HouseWall" as "HouseWall",
    debug: {
      color: attributes.debug?.color,
    },
    passable: false,
  };

  return { ...positionableProperties, ...particularProperties };
};
