import { GRID_INTERVAL } from "../common";
import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { Renderable } from "../types";

interface RenderFixture {
  debugArea: CanvasRenderingContext2D;
  visibleCanvas: HTMLCanvasElement;
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
  const visibleCanvas = document.createElement("canvas");
  visibleCanvas.width = CAMERA_WIDTH;
  visibleCanvas.height = CAMERA_HEIGHT;
  visibleCanvas.style.zIndex = "1";
  visibleCanvas.style.position = "absolute";
  gameArea.appendChild(visibleCanvas);
  const ctx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);

  const offlineGameArea = document.createElement("div");
  offlineGameArea.style.display = `none`;
  offlineGameArea.style.width = `${CAMERA_WIDTH}px`;
  offlineGameArea.style.height = `${CAMERA_HEIGHT}px`;
  offlineGameArea.style.marginLeft = "auto";
  offlineGameArea.style.marginRight = "auto";

  renderables.forEach((renderable) => {
    offlineGameArea.appendChild(renderable.view);
  });

  const debugCanvas = document.createElement("canvas");
  debugCanvas.width = CAMERA_WIDTH;
  debugCanvas.height = CAMERA_HEIGHT;
  debugCanvas.style.zIndex = "10000";
  debugCanvas.style.position = "absolute";
  gameArea.appendChild(debugCanvas);

  return {
    debugArea: debugCanvas.getContext("2d") as CanvasRenderingContext2D,
    visibleCanvas,
  };
}
