import { CAMERA_HEIGHT, CAMERA_WIDTH } from "./common";

export interface Camera {
  x: number;
  y: number;
  offset: () => { x: number; y: number };
}

export const cameraFactory = (attributes: Partial<Camera>): Camera => {
  return {
    x: attributes.x || 0,
    y: attributes.y || 0,
    offset: function () {
      return {
        x: CAMERA_WIDTH / 2 - this.x,
        y: CAMERA_HEIGHT / 2 - this.y,
      };
    },
  };
};
