import { CAMERA_HEIGHT, CAMERA_WIDTH, GRID_INTERVAL } from "./common";

export interface Camera {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
  offset: () => { x: number; y: number };
}

export const cameraFactory = (attributes: Partial<Camera>): Camera => {
  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    offset: function () {
      return {
        x: CAMERA_WIDTH / 2 - this.worldX,
        y: CAMERA_HEIGHT / 2 - this.worldY,
      };
    },
  };
};
