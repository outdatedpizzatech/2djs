export enum Layer {
  GROUND,
  PASSIVE,
  INTERACTIVE,
  OVERHEAD,
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Positionable extends Coordinate {
  worldX: number;
  worldY: number;
}

export interface CoordinateBounds {
  min: Coordinate;
  max: Coordinate;
}

export interface Layerable {
  layer: Layer;
}

export interface Placeable extends Positionable, Layerable {}

export interface Identifiable {
  objectType: string;
  groupId?: number;
}

export interface GameObject extends Placeable, Identifiable {}
