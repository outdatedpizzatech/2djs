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
import houseWallFrameShortSprites from "../sprite_collections/house_wall_frame_short_sprite_collection";
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
  HouseWallShort: houseWallShortSprites[0],
  HouseWallWindow: houseWallWindowSprites[0],
  Roof: roofSprites[0],
  Water: waterSprites[0],
  Flower: flowerSprites[0],
};
