export enum Layer {
  GROUND,
  PASSIVE,
  INTERACTIVE,
  OVERHEAD,
}

export type Unsaved<T> = Omit<T, "_id">;

export type GameObjectTypes =
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
