import { GRID_INTERVAL } from "../common";
import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { Renderable } from "../types";

interface RenderFixture {
  debugArea: CanvasRenderingContext2D;
}

export function renderGameSpace(
  renderables: Renderable<HTMLCanvasElement>[]
): RenderFixture {
  const body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "black";
  const gameArea = document.createElement("div");
  gameArea.style.width = `${CAMERA_WIDTH}px`;
  gameArea.style.height = `${CAMERA_HEIGHT}px`;
  gameArea.style.marginLeft = "auto";
  gameArea.style.marginRight = "auto";
  body.appendChild(gameArea);
  const canvas = document.createElement("canvas");
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;
  canvas.style.zIndex = "1";
  canvas.style.position = "absolute";
  gameArea.appendChild(canvas);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "green";
  for (let x = 0; x < 1000; x++) {
    for (let y = 0; y < 1000; y++) {
      ctx.fillRect(
        x * GRID_INTERVAL,
        y * GRID_INTERVAL,
        GRID_INTERVAL,
        GRID_INTERVAL
      );
    }
  }

  renderables.forEach((renderable) => {
    gameArea.appendChild(renderable.view);
  });

  const debugCanvas = document.createElement("canvas");
  debugCanvas.width = CAMERA_WIDTH;
  debugCanvas.height = CAMERA_HEIGHT;
  debugCanvas.style.zIndex = "10000";
  debugCanvas.style.position = "absolute";
  gameArea.appendChild(debugCanvas);

  return {
    debugArea: debugCanvas.getContext("2d") as CanvasRenderingContext2D,
  };
}
