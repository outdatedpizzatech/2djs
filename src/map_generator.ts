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
      objectType: string;
      layer: number;
      x: number;
      y: number;
      groupId?: string;
      role?: HouseWallRole;
    }) => {
      const { objectType } = data;

      if (objectType == "Empty") {
        return emptyFactory({ ...data, objectType });
      } else if (objectType == "Door") {
        return doorFactory({ ...data, objectType });
      } else if (objectType == "HouseFloor") {
        return houseFloorFactory({ ...data, objectType });
      } else if (objectType == "HouseWall") {
        return houseWallFactory({ ...data, objectType });
      } else if (objectType == "Roof") {
        return roofFactory({ ...data, objectType });
      } else if (objectType == "Street") {
        return streetFactory({ ...data, objectType });
      } else if (objectType == "Water") {
        return waterFactory({ ...data, objectType });
      } else if (objectType == "Tree") {
        return treeFactory({ ...data, objectType });
      } else if (objectType == "Wall") {
        return wallFactory({ ...data, objectType });
      } else if (objectType == "Player") {
        return playerFactory({ ...data, objectType });
      } else if (objectType == "Flower") {
        return flowerFactory({ ...data, objectType });
      }
    }
  );

  return gameObjects;
};
