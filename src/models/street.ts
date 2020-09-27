import { Layer, Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Street extends Debuggable, Placeable {
  objectType: "Street";
}

export const isStreet = (unknownObject: any): unknownObject is Street => {
  if (!unknownObject) return false;
  return (unknownObject as Street).objectType === "Street";
};

export const streetFactory = (attributes: Partial<Street>): Street => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Street" as "Street",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.GROUND,
  };

  return { ...positionableProperties, ...particularProperties };
};
