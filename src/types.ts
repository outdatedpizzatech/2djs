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
  | "HouseWallFrame"
  | "HouseWallWindow"
  | "HouseWallShort"
  | "HouseWallFrameShort"
  | "HouseRoofSteeple"
  | "HouseRoofEdge"
  | "HouseRoof"
  | "Roof"
  | "Street"
  | "Water"
  | "Tree"
  | "Wall"
  | "Player"
  | "Flower"
  | "Stairway"
  | "StairwayTop"
  | "StairwayBottom"
  | "StairwayRailingBottomLeft"
  | "StairwayRailingBottomRight"
  | "Person";
