import { Layer } from "./types";
import { Positionable } from "./positionable";

export interface Layerable {
  layer: Layer;
}

export interface Placeable extends Positionable, Layerable {}

export interface Identifiable {
  objectType: string;
  groupId?: number;
}

export interface GameObject extends Placeable, Identifiable {}
