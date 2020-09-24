import { GRID_INTERVAL } from "../common";
import { Camera } from "../camera";
import sprites from "../sprite_collections/street_sprite_collection";
import { Street } from "../models/street";

export const renderStreet = (
  targetStreet: Street,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { debug } = targetStreet;
  const { worldX, worldY } = camera.project(targetStreet);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  ctx.drawImage(sprites[0], worldX, worldY);
};
