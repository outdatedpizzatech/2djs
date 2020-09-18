import { CAMERA_HEIGHT, CAMERA_WIDTH } from "./common";

export class Camera {
  public x: number;
  public y: number;

  offset() {
    return {
      x: CAMERA_WIDTH / 2 - this.x,
      y: CAMERA_HEIGHT / 2 - this.y,
    };
  }
}
