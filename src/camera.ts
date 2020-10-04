import { GRID_INTERVAL } from "./common";
import { Positionable } from "./positionable";

export const CAMERA_WIDTH = 1152;
export const CAMERA_HEIGHT = 648;

export interface Camera extends Positionable {
  offset: () => { worldX: number; worldY: number };
  project: (renderable: {
    worldX: number;
    worldY: number;
  }) => { worldX: number; worldY: number };
  withinLens: (renderable: { worldX: number; worldY: number }) => boolean;
}

export const cameraFactory = (attributes: Partial<Camera>): Camera => {
  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    worldX: (attributes.x || 0) * GRID_INTERVAL,
    worldY: (attributes.y || 0) * GRID_INTERVAL,
    offset: function () {
      return {
        worldX: CAMERA_WIDTH / 2 - this.worldX,
        worldY: CAMERA_HEIGHT / 2 - this.worldY,
      };
    },
    project: function (renderable: { worldX: number; worldY: number }) {
      const { worldX, worldY } = this.offset();

      return {
        worldX: renderable.worldX + worldX,
        worldY: renderable.worldY + worldY,
      };
    },
    withinLens: function (renderable: { worldX: number; worldY: number }) {
      const { worldX, worldY } = this.project(renderable);

      return (
        worldX >= -GRID_INTERVAL &&
        worldX < CAMERA_WIDTH &&
        worldY >= -GRID_INTERVAL &&
        worldY < CAMERA_HEIGHT
      );
    },
  };
};
