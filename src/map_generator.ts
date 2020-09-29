import corneriaMap from "./maps/corneria.txt";
import { wallFactory } from "./models/wall";
import { treeFactory } from "./models/tree";
import { waterFactory } from "./models/water";
import { streetFactory } from "./models/street";
import { houseWallFactory, HouseWallRole } from "./models/house_wall";
import { houseFloorFactory } from "./models/house_floor";
import {GameObject, Layer} from "./types";
import { roofFactory } from "./models/roof";
import { emptyFactory } from "./models/empty";
import { doorFactory } from "./models/door";
import axios from "axios";

const stringToLayer = (layerName: string): Layer => {
  if (layerName == "overhead") return Layer.OVERHEAD;
  if (layerName == "passive") return Layer.PASSIVE;
  if (layerName == "ground") return Layer.GROUND;
  return Layer.INTERACTIVE;
};

export const generateMap = async(): Promise<GameObject[]> => {
  const result = await axios.get("http://localhost:9000/map");

  const gameObjects = result.data.map((data: {
    objectType: string,
    layer: string,
    x: number,
    y: number,
    groupId?: number,
    role?: string,
  }) => {
    const layer = stringToLayer(data.layer);
    const { objectType } = data;

    if(objectType == "Empty"){
      return emptyFactory({ ...data, objectType, layer });
    } else if(objectType == "Door"){
      return doorFactory({ ...data, objectType, layer })
    } else if(objectType == "HouseFloor"){
      return houseFloorFactory({ ...data, objectType, layer })
    } else if(objectType == "HouseWall"){
      const role = data.role == "front" ? HouseWallRole.FRONT : HouseWallRole.SIDE;
      return houseWallFactory({ ...data, objectType, layer, role })
    } else if(objectType == "Roof"){
      return roofFactory({ ...data, objectType, layer })
    } else if(objectType == "Street"){
      return streetFactory({ ...data, objectType, layer })
    } else if(objectType == "Water"){
      return waterFactory({ ...data, objectType, layer })
    } else if(objectType == "Tree"){
      return treeFactory({ ...data, objectType, layer })
    } else if(objectType == "Wall"){
      return wallFactory({ ...data, objectType, layer })
    }
  });

  return gameObjects;
};
