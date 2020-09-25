import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import sprites from "../sprite_collections/street_sprite_collection";
import { HouseFloor } from "../models/house_floor";

export const renderHouseFloor = (
  targetHouseFloor: HouseFloor,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { debug } = targetHouseFloor;
  const { worldX, worldY } = camera.project(targetHouseFloor);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  ctx.drawImage(sprites[1], worldX, worldY);
};
