import { GRID_INTERVAL } from "./common";
import { Positionable } from "./positionable";

export const CAMERA_WIDTH = 1152;
export const CAMERA_HEIGHT = 648;

export interface Camera extends Positionable {}

export const offset = (camera: Camera) => {
  return {
    worldX: CAMERA_WIDTH / 2 - camera.worldX,
    worldY: CAMERA_HEIGHT / 2 - camera.worldY,
  };
};

export const project = (
  camera: Camera,
  renderable: { worldX: number; worldY: number }
) => {
  const { worldX, worldY } = offset(camera);

  return {
    worldX: renderable.worldX + worldX,
    worldY: renderable.worldY + worldY,
  };
};

export const withinLens = (
  camera: Camera,
  renderable: { worldX: number; worldY: number }
) => {
  const { worldX, worldY } = project(camera, renderable);

  return (
    worldX >= -GRID_INTERVAL &&
    worldX < CAMERA_WIDTH &&
    worldY >= -GRID_INTERVAL &&
    worldY < CAMERA_HEIGHT
  );
};

export const cameraFactory = (attributes: Partial<Camera>): Camera => {
  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
  };
};
