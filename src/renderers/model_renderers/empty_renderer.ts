import { Camera, project } from "../../camera";
import { Empty } from "../../models/empty";
import { GRID_INTERVAL } from "../../common";

export const renderEmpty = (
  model: Empty,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { worldX, worldY } = project(camera, model);

  if (model.debug.color) {
    ctx.fillStyle = model.debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }
};
