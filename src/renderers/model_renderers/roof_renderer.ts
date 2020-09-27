import { Camera } from "../../camera";
import sprites from "../../sprite_collections/roof_sprite_collection";
import { Roof } from "../../models/roof";
import { renderModel } from "../helpers/render_model";
import { GRID_INTERVAL } from "../../common";

export const renderRoof = (
  model: Roof,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number
) => {
  const { worldX, worldY } = camera.project(model);

  if (model.debug.color) {
    ctx.fillStyle = model.debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (xCount > 1) {
    ctx.fillStyle = ctx.createPattern(sprites[0], "repeat") as CanvasPattern;
    ctx.translate(worldX, worldY);
    ctx.fillRect(0, 0, GRID_INTERVAL * xCount, GRID_INTERVAL);
    ctx.translate(-worldX, -worldY);
  } else {
    ctx.drawImage(sprites[0], worldX, worldY);
  }
};
