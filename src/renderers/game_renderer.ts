import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";

interface RenderFixture {
  visibleCanvas: HTMLCanvasElement;
  bufferCanvas: HTMLCanvasElement;
  gameArea: HTMLDivElement;
  body: HTMLBodyElement;
}

export function renderGameSpace(): RenderFixture {
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

  const bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = CAMERA_WIDTH;
  bufferCanvas.height = CAMERA_HEIGHT;

  const exportable: RenderFixture = {
    bufferCanvas,
    visibleCanvas,
    gameArea,
    body,
  };

  return exportable;
}
