import corneriaMap from "./maps/corneria.txt";
import { wallFactory } from "./models/wall";
import { treeFactory } from "./models/tree";
import { waterFactory } from "./models/water";
import { streetFactory } from "./models/street";
import { houseWallFactory } from "./models/house_wall";
import { houseFloorFactory } from "./models/house_floor";
import { GameObject } from "./types";
import { roofFactory } from "./models/roof";

export const generateMap = (): GameObject[] => {
  const placeables = new Array<GameObject>();

  (corneriaMap as string).split(/\n/).forEach((line, y) => {
    line.split("").forEach((code, x) => {
      if (code == "x") {
        placeables.push(wallFactory({ x, y }));
      }
      if (code == "l") {
        placeables.push(treeFactory({ x, y }));
      }
      if (code == "o") {
        placeables.push(waterFactory({ x, y }));
      }
      if (code == "m") {
        placeables.push(streetFactory({ x, y }));
      }
      if (code == "u") {
        placeables.push(houseWallFactory({ x, y }));
        placeables.push(roofFactory({ x, y, groupId: 1 }));
      }
      if (code == "r") {
        placeables.push(houseFloorFactory({ x, y }));
        placeables.push(roofFactory({ x, y, groupId: 1 }));
      }
    });
  });

  return placeables;
};
