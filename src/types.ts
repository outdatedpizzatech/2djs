export interface Positionable {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
}

export interface Massable {
  passable: boolean;
}

export interface Placeable extends Positionable, Massable {}
