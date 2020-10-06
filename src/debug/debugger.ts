import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { frame$, frameWithGameState$, gameState$ } from "../signals";
import { map, throttleTime } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { renderGridLines } from "./grid_lines";
import { Player } from "../models/player";
import { isTree } from "../models/tree";
import { isWall } from "../models/wall";
import { isWater } from "../models/water";
import { isStreet } from "../models/street";
import { isHouseWall } from "../models/house_wall";
import { isHouseFloor } from "../models/house_floor";
import { isRoof } from "../models/roof";
import { Positionable } from "../positionable";
import { mousemove$ } from "../signals/input";
import { GRID_INTERVAL } from "../common";

const mountDebugArea = (body: HTMLBodyElement) => {
  const debugArea = document.createElement("div");
  debugArea.style.width = `${CAMERA_WIDTH}px`;
  debugArea.style.height = `100px`;
  debugArea.style.marginTop = `10px`;
  debugArea.style.marginLeft = "auto";
  debugArea.style.marginRight = "auto";
  debugArea.style.background = "gray";
  body.appendChild(debugArea);

  const gridLinesLabel = document.createElement("label");
  const gridLinesInput = document.createElement("input");
  gridLinesInput.type = "checkbox";
  gridLinesLabel.innerText = "Show Gridlines";
  debugArea.appendChild(gridLinesLabel);
  gridLinesLabel.prepend(gridLinesInput);

  const fpsDiv = document.createElement("div");
  fpsDiv.style.background = "green";
  fpsDiv.style.color = "white";
  debugArea.appendChild(fpsDiv);

  const objectsDiv = document.createElement("div");
  objectsDiv.style.background = "blue";
  objectsDiv.style.color = "white";
  debugArea.appendChild(objectsDiv);

  return {
    gridlines: gridLinesInput,
    fps: fpsDiv,
    objects: objectsDiv,
  };
};

export const loadDebugger = (
  body: HTMLBodyElement,
  gameArea: HTMLDivElement
) => {
  const debug = mountDebugArea(body);

  frame$.pipe(throttleTime(1000)).subscribe((deltaTime) => {
    debug.fps.innerText = `FPS: ${Math.round(1 / deltaTime)}`;
  });

  frameWithGameState$.subscribe(({ gameState }) => {
    const { camera, fieldRenderables } = gameState;
    const playersArray = Object.values(gameState.players) as Player[];
    const positionables = new Array<Positionable>()
      .concat(playersArray)
      .concat(fieldRenderables);
    const objectsInView = positionables.filter((positionable) =>
      camera.withinLens(positionable)
    );
    debug.objects.innerText = `Rendered Objects: ${objectsInView.length}`;
    fieldRenderables.forEach((renderable) => {
      if (isTree(renderable)) renderable.debug.color = "#FFFFFF";
      if (isWall(renderable)) renderable.debug.color = "#0b63bb";
      if (isWater(renderable)) renderable.debug.color = "#acc896";
      if (isStreet(renderable)) renderable.debug.color = "#226e71";
      if (isHouseWall(renderable)) renderable.debug.color = "#599e03";
      if (isHouseFloor(renderable)) renderable.debug.color = "#7417ed";
      if (isRoof(renderable)) renderable.debug.color = "#022efb";
    });
  });

  const $gridlineValue = fromEvent<InputEvent>(
    debug?.gridlines as HTMLInputElement,
    "change"
  ).pipe(map((e) => (e?.target as HTMLInputElement).checked));

  const gridCanvas = document.createElement("canvas");
  gridCanvas.width = CAMERA_WIDTH;
  gridCanvas.height = CAMERA_HEIGHT;
  gridCanvas.style.zIndex = "10000";
  gridCanvas.style.position = "absolute";
  gameArea.appendChild(gridCanvas);

  const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

  $gridlineValue.subscribe((checked) => {
    if (checked) {
      renderGridLines(gridCtx);
    } else {
      gridCtx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    }
  });

  const mouseCanvas = document.createElement("canvas");
  mouseCanvas.width = CAMERA_WIDTH;
  mouseCanvas.height = CAMERA_HEIGHT;
  mouseCanvas.style.zIndex = "10000";
  mouseCanvas.style.position = "absolute";
  gameArea.appendChild(mouseCanvas);

  const mouseCtx = mouseCanvas.getContext("2d") as CanvasRenderingContext2D;

  mousemove$.subscribe((event) => {
    const boundingRect = gridCanvas.getBoundingClientRect();
    mouseCtx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    mouseCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
    const x = event.x - boundingRect.x;
    const y = event.y - boundingRect.y;
    const snapX = Math.floor(x / GRID_INTERVAL) * GRID_INTERVAL;
    const snapY = Math.floor(y / GRID_INTERVAL) * GRID_INTERVAL;
    mouseCtx.fillRect(snapX, snapY + 4, GRID_INTERVAL, GRID_INTERVAL);
    console.log("x ", event.x - boundingRect.x);
    console.log("y ", event.y - boundingRect.y);
  });

  gameState$.pipe(throttleTime(5000)).subscribe((gameState) => {
    console.log("gameState: ", gameState);
  });
};
