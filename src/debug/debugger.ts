import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { frame$, frameWithGameState$, gameState$ } from "../signals";
import { map, throttleTime, withLatestFrom } from "rxjs/operators";
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
import { mousemove$, mouseup$ } from "../signals/input";
import { API_URI_BASE, GRID_INTERVAL } from "../common";
import { GameObject, Placeable } from "../game_object";
import { CoordinateMap } from "../coordinate_map";
import { GameState } from "../game_state";
import axios from "axios";

const mountDebugArea = (body: HTMLBodyElement) => {
  const debugArea = document.createElement("div");
  debugArea.style.width = `${CAMERA_WIDTH}px`;
  debugArea.style.fontFamily = `Helvetica`;
  debugArea.style.fontSize = `12px`;
  debugArea.style.height = `60px`;
  debugArea.style.marginTop = `10px`;
  debugArea.style.marginLeft = "auto";
  debugArea.style.marginRight = "auto";
  debugArea.style.background = "gray";
  debugArea.style.display = "grid";
  debugArea.style.gridTemplateColumns = "10% 10% 10% 10% 10% 10% 10% 10%";
  body.appendChild(debugArea);

  const gridLinesLabel = document.createElement("label");
  const gridLinesInput = document.createElement("input");
  gridLinesInput.type = "checkbox";
  gridLinesLabel.innerText = "Gridlines";
  gridLinesLabel.style.color = "white";
  gridLinesLabel.style.padding = "10%";
  debugArea.appendChild(gridLinesLabel);
  gridLinesLabel.prepend(gridLinesInput);

  const fpsDiv = document.createElement("div");
  fpsDiv.style.background = "green";
  fpsDiv.style.color = "white";
  fpsDiv.style.padding = "10%";
  debugArea.appendChild(fpsDiv);

  const objectsDiv = document.createElement("div");
  objectsDiv.style.background = "blue";
  objectsDiv.style.color = "white";
  objectsDiv.style.padding = "10%";
  debugArea.appendChild(objectsDiv);

  const coordinatesDiv = document.createElement("div");
  coordinatesDiv.style.background = "purple";
  coordinatesDiv.style.color = "white";
  coordinatesDiv.style.padding = "10%";
  debugArea.appendChild(coordinatesDiv);

  const layerInteractiveDiv = document.createElement("div");
  layerInteractiveDiv.style.background = "#333333";
  layerInteractiveDiv.style.color = "white";
  layerInteractiveDiv.style.padding = "10%";
  debugArea.appendChild(layerInteractiveDiv);

  const layerPassiveDiv = document.createElement("div");
  layerPassiveDiv.style.background = "#444444";
  layerPassiveDiv.style.color = "white";
  layerPassiveDiv.style.padding = "10%";
  debugArea.appendChild(layerPassiveDiv);

  const layerGroundDiv = document.createElement("div");
  layerGroundDiv.style.background = "#555555";
  layerGroundDiv.style.color = "white";
  layerGroundDiv.style.padding = "10%";
  debugArea.appendChild(layerGroundDiv);

  const layerOverheadDiv = document.createElement("div");
  layerOverheadDiv.style.background = "#666666";
  layerOverheadDiv.style.color = "white";
  layerOverheadDiv.style.padding = "10%";
  debugArea.appendChild(layerOverheadDiv);

  return {
    gridlines: gridLinesInput,
    fps: fpsDiv,
    objects: objectsDiv,
    coordinates: coordinatesDiv,
    layerInteractiveDiv,
    layerPassiveDiv,
    layerOverheadDiv,
    layerGroundDiv,
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

  const getAtPath = (
    map: CoordinateMap<Placeable>,
    x: number,
    y: number
  ): Partial<GameObject> => {
    const xRow = map[x];
    if (xRow) {
      return xRow[y] || {};
    }

    return {};
  };

  const withSnapping = map((event: MouseEvent) => {
    const boundingRect = gridCanvas.getBoundingClientRect();
    const x = event.x - boundingRect.x;
    const y = event.y - boundingRect.y;
    const snapX = Math.floor(x / GRID_INTERVAL) * GRID_INTERVAL;
    const magicYOffset = 4;
    const snapY = Math.floor(y / GRID_INTERVAL) * GRID_INTERVAL + magicYOffset;
    return { x: snapX, y: snapY };
  });

  const withNormalizedCoordinate = map(
    (params: { gameState: GameState; x: number; y: number }) => {
      const { gameState, x, y } = params;
      const { camera } = gameState;
      const { worldX, worldY } = camera.offset();
      return {
        x: (x - worldX) / GRID_INTERVAL,
        y: (y - worldY) / GRID_INTERVAL,
      };
    }
  );

  const mouseMoveWithNormalizedCoordinate$ = mousemove$.pipe(
    withSnapping,
    withLatestFrom(gameState$),
    map(([{ x, y }, gameState]) => ({ x, y, gameState })),
    withNormalizedCoordinate
  );

  mousemove$.pipe(withSnapping).subscribe(({ x, y }) => {
    mouseCtx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    mouseCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
    mouseCtx.fillRect(x, y, GRID_INTERVAL, GRID_INTERVAL);
  });

  mouseMoveWithNormalizedCoordinate$
    .pipe(withLatestFrom(gameState$))
    .subscribe(([{ x, y }, gameState]) => {
      debug.coordinates.innerText = `Mouse:\r${x},${y}`;

      const interactiveObject = getAtPath(
        gameState.layerMaps.interactableMap,
        x,
        y
      );
      debug.layerInteractiveDiv.innerText = `Interactive Layer: ${
        interactiveObject.objectType || ""
      }`;

      const overheadObject = getAtPath(gameState.layerMaps.overheadMap, x, y);
      debug.layerOverheadDiv.innerText = `Overhead Layer: ${
        overheadObject.objectType || ""
      }`;

      const passiveObject = getAtPath(gameState.layerMaps.passiveMap, x, y);
      debug.layerPassiveDiv.innerText = `Passive Layer: ${
        passiveObject.objectType || ""
      }`;

      const groundObject = getAtPath(gameState.layerMaps.groundMap, x, y);
      debug.layerGroundDiv.innerText = `Ground Layer: ${
        groundObject.objectType || ""
      }`;
    });

  mouseup$
    .pipe(withLatestFrom(mouseMoveWithNormalizedCoordinate$))
    .subscribe(async ([event, { x, y }]) => {
      if (event.button == 0) {
        const result = await axios.post(`${API_URI_BASE}/game_objects`, {
          objectType: "Tree",
          layer: "interactive",
          x,
          y,
        });
      }
    });

  gameState$.pipe(throttleTime(5000)).subscribe((gameState) => {
    console.log("gameState: ", gameState);
  });
};
