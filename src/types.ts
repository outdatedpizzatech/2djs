export interface Positionable {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
}

export interface Renderable<T> {
  view: T;
}
