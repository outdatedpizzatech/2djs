import { GRID_INTERVAL } from "../../common";
import { Camera, project } from "../../camera";
import { isWall, Wall } from "../../models/wall";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { getAtPath, LayerMaps } from "../../coordinate_map";
import { Layer } from "../../types";

export const renderWall = (
  model: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  layerMaps: LayerMaps
) => {
  const { debug, x, y, layer } = model;
  const { worldX, worldY } = project(camera, model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
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
  ctx.drawImage(sprites[spriteIndex], worldX, worldY);
};
