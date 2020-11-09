import { GRID_INTERVAL, GRID_MAGNITUDE, UNIT_BASE } from "../../common";
import { Camera, project } from "../../camera";
import { RenderOptions } from "../model_renderers/types";
import { GameObject } from "../../game_object";

interface Renderable extends GameObject {}

export const renderModel = (
  model: Renderable,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  options: RenderOptions
) => {
  const { worldX: cameraX, worldY: cameraY } = project(camera, model);

  const worldX = options.worldX || cameraX;
  const worldY = options.worldY || cameraY;

  const width = options.dimensions?.width || UNIT_BASE;
  const height = options.dimensions?.height || UNIT_BASE;

  if (model.scale.x != 1) {
    ctx.save();
    ctx.scale(-1, 1);
  }

  const xOffset = model.scale.x == -1 ? GRID_INTERVAL : 0;

  ctx.drawImage(
    sprite,
    worldX * model.scale.x - xOffset,
    worldY - (height - UNIT_BASE) * GRID_MAGNITUDE,
    width * GRID_MAGNITUDE,
    height * GRID_MAGNITUDE
  );

  if (model.scale.x != 1) {
    ctx.restore();
  }

  if (
    options.debug?.selectedGroupId &&
    options.debug.selectedGroupId == model.groupId
  ) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
    ctx.fillRect(worldX, worldY, width, height);
  }
};
