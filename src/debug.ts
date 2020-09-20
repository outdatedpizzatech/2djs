import { GRID_INTERVAL } from "./common";
import { CAMERA_WIDTH, CAMERA_HEIGHT } from "./camera";

export interface Debuggable {
  debug: {
    color?: string;
  };
}

export const renderGridLines = (ctx: CanvasRenderingContext2D) => {
  const yOffset = (CAMERA_HEIGHT % GRID_INTERVAL) / 2;

  ctx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

  for (let x = 0; x < CAMERA_WIDTH / GRID_INTERVAL; x++) {
    ctx.beginPath();
    ctx.moveTo(x * GRID_INTERVAL, 0);
    ctx.lineTo(x * GRID_INTERVAL, CAMERA_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y < CAMERA_HEIGHT / GRID_INTERVAL; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * GRID_INTERVAL + yOffset);
    ctx.lineTo(CAMERA_WIDTH, y * GRID_INTERVAL + yOffset);
    ctx.stroke();
  }
};
