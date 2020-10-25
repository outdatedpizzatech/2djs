export enum Layer {
  GROUND,
  PASSIVE,
  INTERACTIVE,
  OVERHEAD,
}

export type Unsaved<T> = Omit<T, "_id">;

export type GameObjectType =
  | "Empty"
  | "Door"
  | "HouseFloor"
  | "HouseWall"
  | "Roof"
  | "Street"
  | "Water"
  | "Tree"
  | "Wall"
  | "Player"
  | "Flower";
