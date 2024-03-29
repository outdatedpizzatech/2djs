import { wallFactory } from "./models/wall";
import { treeFactory } from "./models/tree";
import { waterFactory } from "./models/water";
import { streetFactory } from "./models/street";
import { houseWallFactory } from "./models/house_wall";
import { houseFloorFactory } from "./models/house_floor";
import { roofFactory } from "./models/roof";
import { emptyFactory } from "./models/empty";
import { doorFactory } from "./models/door";
import axios from "axios";
import { playerFactory } from "./models/player";
import { personFactory } from "./models/person";
import { CoordinateBounds } from "./coordinate";
import { GameObject } from "./game_object";
import { API_URI_BASE } from "./common";
import { flowerFactory } from "./models/flower";
import { GameObjectType, Unsaved } from "./types";
import { houseWallFrameFactory } from "./models/house_wall_frame";
import { houseWallWindowFactory } from "./models/house_wall_window";
import { houseWallShortFactory } from "./models/house_wall_short";
import { houseWallFrameShortFactory } from "./models/house_wall_frame_short";
import { houseRoofSteepleFactory } from "./models/house_roof_steeple";
import { houseRoofEdgeFactory } from "./models/house_roof_edge";
import { houseRoofFactory } from "./models/house_roof";
import { stairwayFactory } from "./models/stairway";
import { stairwayBottomFactory } from "./models/stairway_bottom";
import { stairwayTopFactory } from "./models/stairway_top";
import { stairwayRailingBottomLeftFactory } from "./models/stairway_railing_bottom_left";
import { stairwayRailingBottomRightFactory } from "./models/stairway_railing_bottom_right";

const factoryFns: {
  [K in GameObjectType]: (attrs: Partial<GameObject>) => Unsaved<GameObject>;
} = {
  Empty: emptyFactory,
  Door: doorFactory,
  HouseFloor: houseFloorFactory,
  HouseWall: houseWallFactory,
  HouseWallFrame: houseWallFrameFactory,
  HouseWallFrameShort: houseWallFrameShortFactory,
  HouseRoofSteeple: houseRoofSteepleFactory,
  HouseRoofEdge: houseRoofEdgeFactory,
  HouseRoof: houseRoofFactory,
  HouseWallWindow: houseWallWindowFactory,
  HouseWallShort: houseWallShortFactory,
  Roof: roofFactory,
  Street: streetFactory,
  Water: waterFactory,
  Tree: treeFactory,
  Wall: wallFactory,
  Player: playerFactory,
  Person: personFactory,
  Flower: flowerFactory,
  Stairway: stairwayFactory,
  StairwayBottom: stairwayBottomFactory,
  StairwayTop: stairwayTopFactory,
  StairwayRailingBottomLeft: stairwayRailingBottomLeftFactory,
  StairwayRailingBottomRight: stairwayRailingBottomRightFactory,
};

export const generateMap = async (
  coordinateBounds: CoordinateBounds & { mapId: string | null }
): Promise<GameObject[]> => {
  const { x: xMin, y: yMin } = coordinateBounds.min;
  const { x: xMax, y: yMax } = coordinateBounds.max;
  const { mapId } = coordinateBounds;

  let uri = `${API_URI_BASE}/map?xMin=${xMin}&xMax=${xMax}&yMin=${yMin}&yMax=${yMax}`;

  if (mapId) {
    uri += `&mapId=${mapId}`;
  }

  const result = await axios.get(uri);

  const gameObjects = result.data.map((data: any) => {
    const { objectType } = data;
    const factoryFn = factoryFns[data.objectType as GameObjectType];

    return factoryFn({ ...data, objectType });
  });

  return gameObjects;
};
