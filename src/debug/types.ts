export type GameObjectType =
  | "tree"
  | "wall"
  | "street"
  | "door"
  | "empty"
  | "house_floor"
  | "house_wall_front"
  | "house_wall_side"
  | "roof"
  | "water"
  | "flower";

export interface DebugArea {
  gridlines: HTMLInputElement;
  fps: HTMLDivElement;
  objects: HTMLDivElement;
  coordinates: HTMLDivElement;
  layerInspectorDiv: HTMLDivElement;
}
