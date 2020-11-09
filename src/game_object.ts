import { GameObjectType, Layer } from "./types";
import { Positionable, positionableFactory } from "./positionable";

export interface Layerable {
  layer: Layer;
}

interface Scalable {
  scale: {
    x: number;
    y: number;
  };
}

export interface Placeable extends Positionable, Layerable {}

export interface Identifiable {
  objectType: GameObjectType;
  groupId?: string;
  mapId?: string | null;
  _id: string;
}

export interface GameObject extends Placeable, Identifiable, Scalable {
  isStructure?: boolean;
}

export const scalableFactory = (attributes: Partial<Scalable>): Scalable => {
  return {
    scale: {
      x: attributes.scale?.x || 1,
      y: attributes.scale?.y || 1,
    },
  };
};

export const gameObjectFactory = (
  attributes: Partial<Scalable> & Partial<Positionable> & Partial<Identifiable>
): Scalable & Positionable => ({
  ...scalableFactory(attributes),
  ...positionableFactory(attributes),
  ...{ mapId: attributes.mapId },
});
