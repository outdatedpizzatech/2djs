import { GRID_INTERVAL } from "../../common";
import { Camera } from "../../camera";
import { isWall, Wall } from "../../models/wall";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { CoordinateMap, getFromCoordinateMap } from "../../coordinate_map";
import { Positionable } from "../../types";

export const renderWall = (
  model: Wall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  coordinateMap: CoordinateMap<Positionable>
) => {
  const { debug, x, y } = model;
  const { worldX, worldY } = camera.project(model);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

  const hasVerticalWallNeighbors =
    isWall(getFromCoordinateMap(x, y + 1, coordinateMap)) ||
    isWall(getFromCoordinateMap(x, y + 1, coordinateMap));
  const spriteIndex = hasVerticalWallNeighbors ? 1 : 0;
  ctx.drawImage(sprites[spriteIndex], worldX, worldY);
};
