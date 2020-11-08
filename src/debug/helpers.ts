import treeSprites from "../sprite_collections/tree_sprite_collection";
import wallSprites from "../sprite_collections/wall_sprite_collection";
import houseWallSprites from "../sprite_collections/wall_sprite_collection";
import streetSprites from "../sprite_collections/street_sprite_collection";
import houseFloorSprites from "../sprite_collections/street_sprite_collection";
import doorSprites from "../sprite_collections/door_sprite_collection";
import roofSprites from "../sprite_collections/roof_sprite_collection";
import waterSprites from "../sprite_collections/water_sprite_collection";
import flowerSprites from "../sprite_collections/flower_sprite_collection";
import houseWallFrameSprites from "../sprite_collections/house_wall_frame_sprite_collection";
import houseWallWindowSprites from "../sprite_collections/house_wall_window_sprite_collection";
import houseWallShortSprites from "../sprite_collections/house_wall_short_sprite_collection";
import houseRoofSteepleSprites from "../sprite_collections/house_roof_steeple_sprite_collection";
import houseRoofEdgeSprites from "../sprite_collections/house_roof_edge_sprite_collection";
import houseWallFrameShortSprites from "../sprite_collections/house_wall_frame_short_sprite_collection";
import houseRoofSprites from "../sprite_collections/house_roof_sprite_collection";
import stairwaySprites from "../sprite_collections/stairway_sprite_collection";
import stairwayBottomSprites from "../sprite_collections/stairway_bottom_sprite_collection";
import stairwayTopSprites from "../sprite_collections/stairway_top_sprite_collection";
import stairwayRailingBottomLeftSprites from "../sprite_collections/stairway_railing_bottom_left_sprite_collection";
import stairwayRailingBottomRightSprites from "../sprite_collections/stairway_railing_bottom_right_sprite_collection";
import { EditableGameObjectType } from "./types";

export const objectToSpriteMap: {
  [K in EditableGameObjectType]: HTMLImageElement;
} = {
  Tree: treeSprites[0],
  Wall: wallSprites[0],
  Street: streetSprites[0],
  Door: doorSprites[0],
  Empty: document.createElement("img"),
  HouseFloor: houseFloorSprites[1],
  HouseWall: houseWallSprites[3],
  HouseWallFrame: houseWallFrameSprites[0],
  HouseWallFrameShort: houseWallFrameShortSprites[0],
  HouseRoofSteeple: houseRoofSteepleSprites[0],
  HouseRoofEdge: houseRoofEdgeSprites[0],
  HouseRoof: houseRoofSprites[0],
  HouseWallShort: houseWallShortSprites[0],
  HouseWallWindow: houseWallWindowSprites[0],
  Roof: roofSprites[0],
  Water: waterSprites[0],
  Flower: flowerSprites[0],
  Stairway: stairwaySprites[0],
  StairwayTop: stairwayTopSprites[0],
  StairwayBottom: stairwayBottomSprites[0],
  StairwayRailingBottomLeft: stairwayRailingBottomLeftSprites[0],
  StairwayRailingBottomRight: stairwayRailingBottomRightSprites[0],
};
