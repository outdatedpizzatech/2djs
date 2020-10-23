import treeSprites from "../sprite_collections/tree_sprite_collection";
import wallSprites from "../sprite_collections/wall_sprite_collection";
import houseWallSprites from "../sprite_collections/wall_sprite_collection";
import streetSprites from "../sprite_collections/street_sprite_collection";
import houseFloorSprites from "../sprite_collections/street_sprite_collection";
import doorSprites from "../sprite_collections/door_sprite_collection";
import roofSprites from "../sprite_collections/roof_sprite_collection";
import waterSprites from "../sprite_collections/water_sprite_collection";
import flowerSprites from "../sprite_collections/flower_sprite_collection";
import { GameObjectType } from "./types";

export const objectToSpriteMap: { [K in GameObjectType]: HTMLImageElement } = {
  tree: treeSprites[0],
  wall: wallSprites[0],
  street: streetSprites[0],
  door: doorSprites[0],
  empty: document.createElement("img"),
  house_floor: houseFloorSprites[1],
  house_wall_side: houseWallSprites[2],
  house_wall_front: houseWallSprites[3],
  roof: roofSprites[0],
  water: waterSprites[0],
  flower: flowerSprites[0],
};
