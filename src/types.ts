export enum Layer {
  GROUND,
  INTERACTION,
  OVERHEAD,
}

export interface Positionable {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
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
