import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";

interface RenderFixture {
  visibleCanvas: HTMLCanvasElement;
  bufferCanvas: HTMLCanvasElement;
  gameArea: HTMLDivElement;
  debug?: {
    gridlines: HTMLInputElement;
    fps: HTMLDivElement;
    objects: HTMLDivElement;
  };
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
  const ctx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);

  const exportable: RenderFixture = {
    bufferCanvas,
    visibleCanvas,
    gameArea,
  };

  if (process.env.DEBUG) {
    const debugArea = document.createElement("div");
    debugArea.style.width = `${CAMERA_WIDTH}px`;
    debugArea.style.height = `100px`;
    debugArea.style.marginTop = `10px`;
    debugArea.style.marginLeft = "auto";
    debugArea.style.marginRight = "auto";
    debugArea.style.background = "gray";
    body.appendChild(debugArea);

    const gridLinesSpan = document.createElement("span");
    const gridLinesInput = document.createElement("input");
    gridLinesInput.type = "checkbox";
    gridLinesSpan.innerText = "Show Gridlines";
    debugArea.appendChild(gridLinesSpan);
    gridLinesSpan.prepend(gridLinesInput);

    const fpsDiv = document.createElement("div");
    fpsDiv.style.background = "green";
    fpsDiv.style.color = "white";
    debugArea.appendChild(fpsDiv);

    const objectsDiv = document.createElement("div");
    objectsDiv.style.background = "blue";
    objectsDiv.style.color = "white";
    debugArea.appendChild(objectsDiv);

    exportable.debug = {
      gridlines: gridLinesInput,
      fps: fpsDiv,
      objects: objectsDiv,
    };
  }

  return exportable;
}
