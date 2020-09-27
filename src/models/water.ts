import { Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Water extends Debuggable, Placeable {
  objectType: "Water";
}

export const isWater = (unknownObject: any): unknownObject is Water => {
  if (!unknownObject) return false;
  return (unknownObject as Water).objectType === "Water";
};

export const waterFactory = (attributes: Partial<Water>): Water => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Water" as "Water",
    debug: {
      color: attributes.debug?.color,
    },
    passable: false,
  };

  return { ...positionableProperties, ...particularProperties };
};
