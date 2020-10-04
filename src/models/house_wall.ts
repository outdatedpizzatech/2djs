import { Debuggable } from "../debug/grid_lines";
import { GameObject } from "../game_object";
import { positionableFactory } from "../positionable";
import { Layer } from "../types";

export enum HouseWallRole {
  SIDE,
  FRONT,
}

export interface HouseWall extends Debuggable, GameObject {
  objectType: "HouseWall";
  role: HouseWallRole;
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
    layer: Layer.INTERACTIVE,
    groupId: attributes.groupId,
    role: attributes.role || HouseWallRole.SIDE,
  };

  return { ...positionableProperties, ...particularProperties };
};
