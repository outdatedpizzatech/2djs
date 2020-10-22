import { Camera, project } from "../../camera";
import { Empty } from "../../models/empty";
import { GRID_INTERVAL } from "../../common";
import { RenderOptions } from "./types";

export const renderEmpty = (
  model: Empty,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const { worldX, worldY } = project(camera, model);

  if (
    options.debug.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }
};
