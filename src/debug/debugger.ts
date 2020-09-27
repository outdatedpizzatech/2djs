import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { frame$, frameWithGameState$, gameState$ } from "../signals";
import { map, throttleTime } from "rxjs/operators";
import { Positionable } from "../types";
import { fromEvent } from "rxjs";
import { renderGridLines } from "./grid_lines";
import { Player } from "../models/player";
import { isTree } from "../models/tree";
import { isWall } from "../models/wall";
import { isWater } from "../models/water";
import { isStreet } from "../models/street";
import { isHouseWall } from "../models/house_wall";
import { isHouseFloor } from "../models/house_floor";

const mountDebugArea = (body: HTMLBodyElement) => {
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

  return {
    gridlines: gridLinesInput,
    fps: fpsDiv,
    objects: objectsDiv,
  };
};

export const loadDebugger = (
  body: HTMLBodyElement,
  gameArea: HTMLDivElement,
  players: Player[],
  fieldRenderables: any[]
) => {
  const debug = mountDebugArea(body);

  frame$.pipe(throttleTime(1000)).subscribe((deltaTime) => {
    debug.fps.innerText = `FPS: ${Math.round(1 / deltaTime)}`;
  });

  frameWithGameState$.subscribe(([_, gameState]) => {
    const { camera, player, otherPlayer, fieldRenderables } = gameState;
    const positionables = new Array<Positionable>()
      .concat([player, otherPlayer])
      .concat(fieldRenderables);
    const objectsInView = positionables.filter((positionable) =>
      camera.withinLens(positionable)
    );
    debug.objects.innerText = `Rendered Objects: ${objectsInView.length}`;
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

  gameState$.pipe(throttleTime(5000)).subscribe((gameState) => {
    console.log("gameState: ", gameState);
  });
  players[0].debug.color = "red";
  players[1].debug.color = "blue";
  fieldRenderables.forEach((renderable) => {
    if (isTree(renderable)) renderable.debug.color = "#FFFFFF";
    if (isWall(renderable)) renderable.debug.color = "#0b63bb";
    if (isWater(renderable)) renderable.debug.color = "#acc896";
    if (isStreet(renderable)) renderable.debug.color = "#226e71";
    if (isHouseWall(renderable)) renderable.debug.color = "#599e03";
    if (isHouseFloor(renderable)) renderable.debug.color = "#7417ed";
  });
};
