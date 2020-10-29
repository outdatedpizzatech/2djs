import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { renderGridLines } from "./grid_lines";
import { mouse0held$, mouse2held$, mousemove$ } from "../signals/input";
import { GRID_INTERVAL } from "../common";
import { addObject, getGroup, removeObject, setGroup } from "./editor";
import { objectToSpriteMap } from "./helpers";
import { mountDebugArea } from "./dom";
import { updateObjectsInView } from "./objects_in_view";
import { showLayerTooltip } from "./layer_tooltip";
import { withNormalizedCoordinate, withSnapping } from "./mouse";
import { EditableGameObjectType } from "./types";
import { scaleX$, selectedEditorObject$, selectedGroupUuid$ } from "./signals";
import { coordinatesToLoadForMyPlayerSubject$ } from "../signals/subjects";
import { gameState$ } from "../signals/game_state";
import { currentMapId$ } from "../signals/map";
import { frame$, frameWithGameState$ } from "../signals/frame";
import { coordinatesToLoadForMyPlayer$ } from "../signals/my_player";

export const loadDebugger = (
  body: HTMLBodyElement,
  gameArea: HTMLDivElement
) => {
  const debug = mountDebugArea(body);

  frame$.pipe(throttleTime(1000)).subscribe((deltaTime) => {
    debug.fps.innerText = `FPS: ${Math.round(1 / deltaTime)}`;
  });

  frameWithGameState$
    .pipe(withLatestFrom(coordinatesToLoadForMyPlayer$))
    .subscribe(([{ gameState }, coordinate]) => {
      updateObjectsInView({
        gameState,
        coordinate,
        debug,
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

  const mouseMoveWithNormalizedCoordinate$ = mousemove$.pipe(
    withSnapping(gridCanvas),
    withLatestFrom(gameState$),
    map(([{ x, y }, gameState]) => ({ x, y, gameState })),
    withNormalizedCoordinate
  );

  mousemove$.pipe(withSnapping(gridCanvas)).subscribe(({ x, y }) => {
    mouseCtx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    mouseCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
    mouseCtx.fillRect(x, y, GRID_INTERVAL, GRID_INTERVAL);
  });

  mouseMoveWithNormalizedCoordinate$
    .pipe(withLatestFrom(gameState$))
    .subscribe(([{ x, y }, gameState]) => {
      showLayerTooltip({ gameState, x, y, debug });
    });

  frame$
    .pipe(
      withLatestFrom(mouse0held$),
      filter(([_, mouseHeld]) => mouseHeld),
      withLatestFrom(mouseMoveWithNormalizedCoordinate$),
      withLatestFrom(gameState$),
      withLatestFrom(selectedEditorObject$),
      withLatestFrom(scaleX$),
      withLatestFrom(currentMapId$),
      map(
        ([
          [[[[[_], { x, y }], gameState], selectedObject], scaleX],
          mapId,
        ]) => ({
          x,
          y,
          gameState,
          selectedObject,
          scaleX,
          mapId,
        })
      ),
      filter(
        ({ selectedObject }) =>
          !!objectToSpriteMap[selectedObject as EditableGameObjectType]
      )
    )
    .subscribe(addObject);

  frame$
    .pipe(
      withLatestFrom(mouse0held$),
      filter(([_, mouseHeld]) => mouseHeld),
      withLatestFrom(mouseMoveWithNormalizedCoordinate$),
      withLatestFrom(gameState$),
      withLatestFrom(selectedEditorObject$),
      map(([[[[_], { x, y }], gameState], selectedObject]) => ({
        x,
        y,
        gameState,
        selectedObject,
      })),
      filter(({ selectedObject }) => selectedObject == "pickGroup")
    )
    .subscribe(getGroup);

  frame$
    .pipe(
      withLatestFrom(mouse0held$),
      filter(([_, mouseHeld]) => mouseHeld),
      withLatestFrom(mouseMoveWithNormalizedCoordinate$),
      withLatestFrom(gameState$),
      withLatestFrom(selectedEditorObject$),
      withLatestFrom(selectedGroupUuid$),
      map(([[[[[_], { x, y }], gameState], selectedObject], groupId]) => ({
        x,
        y,
        gameState,
        selectedObject,
        groupId,
      })),
      filter(({ selectedObject }) => selectedObject == "setGroup")
    )
    .subscribe(setGroup);

  frame$
    .pipe(
      withLatestFrom(mouse2held$),
      filter(([_, mouseHeld]) => mouseHeld),
      withLatestFrom(mouseMoveWithNormalizedCoordinate$),
      withLatestFrom(gameState$),
      map(([[_, { x, y }], gameState]) => ({ x, y, gameState }))
    )
    .subscribe(removeObject);

  gameState$.pipe(throttleTime(5000)).subscribe((gameState) => {
    console.log("gameState: ", gameState);
  });
};
