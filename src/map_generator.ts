import { wallFactory } from "./models/wall";
import { treeFactory } from "./models/tree";
import { waterFactory } from "./models/water";
import { streetFactory } from "./models/street";
import { houseWallFactory, HouseWallRole } from "./models/house_wall";
import { houseFloorFactory } from "./models/house_floor";
import { roofFactory } from "./models/roof";
import { emptyFactory } from "./models/empty";
import { doorFactory } from "./models/door";
import axios from "axios";
import { playerFactory } from "./models/player";
import { CoordinateBounds } from "./coordinate";
import { GameObject } from "./game_object";
import { API_URI_BASE } from "./common";
import { flowerFactory } from "./models/flower";
import { GameObjectTypes, Unsaved } from "./types";

const factoryFns: {
  [K in GameObjectTypes]: (attrs: Partial<GameObject>) => Unsaved<GameObject>;
} = {
  Empty: emptyFactory,
  Door: doorFactory,
  HouseFloor: houseFloorFactory,
  HouseWall: houseWallFactory,
  Roof: roofFactory,
  Street: streetFactory,
  Water: waterFactory,
  Tree: treeFactory,
  Wall: wallFactory,
  Player: playerFactory,
  Flower: flowerFactory,
};

export const generateMap = async (
  coordinateBounds: CoordinateBounds
): Promise<GameObject[]> => {
  const { x: xMin, y: yMin } = coordinateBounds.min;
  const { x: xMax, y: yMax } = coordinateBounds.max;

  const result = await axios.get(
    `${API_URI_BASE}/map?xMin=${xMin}&xMax=${xMax}&yMin=${yMin}&yMax=${yMax}`
  );

  const gameObjects = result.data.map(
    (data: {
      _id: string;
      objectType: GameObjectTypes;
      layer: number;
      x: number;
      y: number;
      groupId?: string;
      role?: HouseWallRole;
    }) => {
      const { objectType } = data;
      const factoryFn = factoryFns[data.objectType];

      return factoryFn({ ...data, objectType });
    }
  );

  return gameObjects;
};
