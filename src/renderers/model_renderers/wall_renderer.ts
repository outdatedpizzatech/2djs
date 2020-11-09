import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import { Wall } from "../../models/wall";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { LayerMaps } from "../../coordinate_map";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderWall = (
  model: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  if (
    options.debug?.selectedGroupId &&
    options.debug?.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  renderModel(model, camera, ctx, sprites[0], options);
};
