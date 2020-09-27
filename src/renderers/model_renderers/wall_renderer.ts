import { GRID_INTERVAL } from "../../common";
import { Camera } from "../../camera";
import { isWall, Wall } from "../../models/wall";
import sprites from "../../sprite_collections/wall_sprite_collection";
import {
  CoordinateMap,
  getFromCoordinateMap,
  LayerMaps,
} from "../../coordinate_map";
import { Layer, Positionable } from "../../types";

export const renderWall = (
  model: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  layerMaps: LayerMaps
) => {
  const { debug, x, y, layer } = model;
  const { worldX, worldY } = camera.project(model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  const layerMap =
    layer === Layer.INTERACTION
      ? layerMaps.interactableMap
      : layer === Layer.OVERHEAD
      ? layerMaps.overheadMap
      : layerMaps.groundMap;

  const hasVerticalWallNeighbors =
    isWall(getFromCoordinateMap(x, y + 1, layerMap)) ||
    isWall(getFromCoordinateMap(x, y + 1, layerMap));
  const spriteIndex = hasVerticalWallNeighbors ? 1 : 0;
  ctx.drawImage(sprites[spriteIndex], worldX, worldY);
};
