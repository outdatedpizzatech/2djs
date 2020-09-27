import { Layer, Placeable } from "../types";
import { Debuggable } from "../debug/grid_lines";
import { positionableFactory } from "./helpers/positionable_factory";

export interface Roof extends Debuggable, Placeable {
  objectType: "Roof";
}

export const isRoof = (unknownObject: any): unknownObject is Roof => {
  if (!unknownObject) return false;
  return (unknownObject as Roof).objectType === "Roof";
};

export const roofFactory = (attributes: Partial<Roof>): Roof => {
  const positionableProperties = positionableFactory(attributes);
  const particularProperties = {
    objectType: "Roof" as "Roof",
    debug: {
      color: attributes.debug?.color,
    },
    layer: Layer.OVERHEAD,
  };

  return { ...positionableProperties, ...particularProperties };
};
