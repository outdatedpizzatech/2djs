import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import { isWall, Wall } from "../../models/wall";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { getAtPath, LayerMaps } from "../../coordinate_map";
import { Layer } from "../../types";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderWall = (
  model: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  layerMaps: LayerMaps,
  count: number,
  options: RenderOptions
) => {
  const { x, y, layer } = model;
  const { worldX, worldY } = project(camera, model);

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  if (count == 0) {
    return;
  }

  const layerMap =
    layer === Layer.INTERACTIVE
      ? layerMaps.interactiveMap
      : layer === Layer.OVERHEAD
      ? layerMaps.overheadMap
      : layerMaps.groundMap;

  const hasVerticalWallNeighbors =
    isWall(getAtPath(layerMap, x, y + 1)) ||
    isWall(getAtPath(layerMap, x, y + 1));
  const spriteIndex = hasVerticalWallNeighbors ? 1 : 0;

  renderModel(model, camera, ctx, sprites[spriteIndex], count, options);
};
