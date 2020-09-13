import {CAMERA_HEIGHT, CAMERA_WIDTH} from "./common";

export class Camera {
  private x: number;
  private y: number;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  offset() {
    return {
      x: CAMERA_WIDTH / 2 - this.x,
      y: CAMERA_HEIGHT / 2 - this.y,
    };
  }
}
