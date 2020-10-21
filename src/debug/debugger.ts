import { CAMERA_HEIGHT, CAMERA_WIDTH, offset, withinLens } from "../camera";
import {
  coordinatesToLoadForMyPlayer$,
  frame$,
  frameWithGameState$,
  gameState$,
  layerVisibility$,
  selectedGroupUuid$,
  selectedGroupUuidSubject$,
} from "../signals";
import {
  filter,
  map,
  startWith,
  throttleTime,
  withLatestFrom,
} from "rxjs/operators";
import { fromEvent, Subject } from "rxjs";
import { Debuggable, renderGridLines } from "./grid_lines";
import { Player } from "../models/player";
import { isTree } from "../models/tree";
import { isWall } from "../models/wall";
import { isWater } from "../models/water";
import { isStreet } from "../models/street";
import { isHouseWall } from "../models/house_wall";
import { isHouseFloor } from "../models/house_floor";
import { isRoof } from "../models/roof";
import { mouse0held$, mouse2held$, mousemove$ } from "../signals/input";
import { GRID_INTERVAL } from "../common";
import { getAtPath } from "../coordinate_map";
import { GameState } from "../game_state";
import { getLoadBoundsForCoordinate } from "../coordinate";
import { GameObject } from "../game_object";
import { Layer } from "../types";
import treeSprites from "../sprite_collections/tree_sprite_collection";
import wallSprites from "../sprite_collections/wall_sprite_collection";
import houseWallSprites from "../sprite_collections/wall_sprite_collection";
import streetSprites from "../sprite_collections/street_sprite_collection";
import houseFloorSprites from "../sprite_collections/street_sprite_collection";
import doorSprites from "../sprite_collections/door_sprite_collection";
import roofSprites from "../sprite_collections/roof_sprite_collection";
import waterSprites from "../sprite_collections/water_sprite_collection";
import { isEmpty } from "../models/empty";
import { addObject, getGroup, removeObject, setGroup } from "./editor";
import { v4 as uuidv4 } from "uuid";

const selectedEditorObjectSubject$: Subject<string> = new Subject();
const selectedEditorObject$ = selectedEditorObjectSubject$
  .asObservable()
  .pipe(startWith(""));

export type GameObjectType =
  | "tree"
  | "wall"
  | "street"
  | "door"
  | "empty"
  | "house_floor"
  | "house_wall_front"
  | "house_wall_side"
  | "roof"
  | "water";

const objectToSpriteMap: { [K in GameObjectType]: HTMLImageElement } = {
  tree: treeSprites[0],
  wall: wallSprites[0],
  street: streetSprites[0],
  door: doorSprites[0],
  empty: document.createElement("img"),
  house_floor: houseFloorSprites[1],
  house_wall_side: houseWallSprites[2],
  house_wall_front: houseWallSprites[3],
  roof: roofSprites[0],
  water: waterSprites[0],
};

const mountDebugArea = (body: HTMLBodyElement) => {
  const debugArea = document.createElement("div");
  debugArea.style.width = `${CAMERA_WIDTH}px`;
  debugArea.style.fontFamily = `Helvetica`;
  debugArea.style.fontSize = `12px`;
  debugArea.style.marginTop = `10px`;
  debugArea.style.marginLeft = "auto";
  debugArea.style.marginRight = "auto";
  debugArea.style.background = "gray";
  debugArea.style.display = "grid";
  debugArea.style.gridTemplateColumns = "10% 10% 10% 10% 10% 20%";
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

  const layerDiv = document.createElement("div");
  layerDiv.style.background = "red";
  layerDiv.style.color = "white";
  layerDiv.style.padding = "10%";
  debugArea.appendChild(layerDiv);

  const groupDiv = document.createElement("div");
  groupDiv.style.background = "brown";
  groupDiv.style.color = "white";
  groupDiv.style.padding = "10%";
  debugArea.appendChild(groupDiv);

  const groupLabel = document.createElement("label");
  groupDiv.appendChild(groupLabel);

  const shuffleButton = document.createElement("button");
  shuffleButton.innerText = "Shuffle ID";
  shuffleButton.style.display = "block";
  shuffleButton.addEventListener("click", () => {
    const uuid = uuidv4();
    selectedGroupUuidSubject$.next(uuid);
  });
  groupDiv.appendChild(shuffleButton);

  const pickGroupButton = document.createElement("button");
  pickGroupButton.innerText = "Pick";
  pickGroupButton.style.display = "block";
  pickGroupButton.addEventListener("click", () => {
    selectedEditorObjectSubject$.next("pickGroup");
  });
  groupDiv.appendChild(pickGroupButton);

  const setGroupButton = document.createElement("button");
  setGroupButton.innerText = "Set";
  setGroupButton.style.display = "block";
  setGroupButton.addEventListener("click", () => {
    selectedEditorObjectSubject$.next("setGroup");
  });
  groupDiv.appendChild(setGroupButton);

  const addLayerCheckbox = (layer: Layer, name: string) => {
    const layerLabel = document.createElement("label");
    layerLabel.style.display = "block";
    const layerCheckbox = document.createElement("input");
    layerCheckbox.type = "checkbox";
    layerCheckbox.checked = true;
    layerCheckbox.addEventListener("click", function () {
      layerVisibility$.next({ layer, visible: this.checked });
    });
    layerLabel.innerText = name;
    layerLabel.prepend(layerCheckbox);
    layerDiv.appendChild(layerLabel);
  };

  addLayerCheckbox(Layer.GROUND, "Ground");
  addLayerCheckbox(Layer.PASSIVE, "Passive");
  addLayerCheckbox(Layer.INTERACTIVE, "Interactive");
  addLayerCheckbox(Layer.OVERHEAD, "Overhead");

  const layerInspectorDiv = document.createElement("div");
  layerInspectorDiv.style.fontFamily = `Monospace`;
  layerInspectorDiv.style.fontSize = `12px`;
  layerInspectorDiv.style.background = "#333333";
  layerInspectorDiv.style.color = "white";
  layerInspectorDiv.style.position = "absolute";
  layerInspectorDiv.style.top = "0";
  layerInspectorDiv.style.left = "0";
  layerInspectorDiv.style.zIndex = "9999999999999";
  layerInspectorDiv.style.opacity = "0.95";

  body.appendChild(layerInspectorDiv);

  const editorArea = document.createElement("div");
  editorArea.style.width = `${CAMERA_WIDTH}px`;
  editorArea.style.fontFamily = `Helvetica`;
  editorArea.style.fontSize = `12px`;
  editorArea.style.marginTop = `10px`;
  editorArea.style.marginLeft = "auto";
  editorArea.style.marginRight = "auto";
  editorArea.style.background = "gray";
  editorArea.style.display = "grid";
  editorArea.style.gridTemplateColumns = "repeat(20, auto)";
  body.appendChild(editorArea);

  Object.keys(objectToSpriteMap).forEach((key: GameObjectType) => {
    const objectDiv = document.createElement("div");
    objectDiv.style.color = "white";
    objectDiv.style.padding = "10%";
    objectDiv.style.textAlign = "center";
    objectDiv.id = `object-${key}`;
    editorArea.appendChild(objectDiv);

    const labelDiv = document.createElement("div");
    labelDiv.innerText = key;
    labelDiv.style.fontSize = "10px";
    const sprite = objectToSpriteMap[key];
    sprite.width = 16;
    sprite.height = 16;
    objectDiv.appendChild(sprite);
    objectDiv.appendChild(labelDiv);
  });

  selectedEditorObject$.subscribe((value) => {
    Object.keys(objectToSpriteMap).forEach((key: GameObjectType) => {
      const objectDiv = document.getElementById(
        `object-${key}`
      ) as HTMLDivElement;

      objectDiv.onclick = () => {
        selectedEditorObjectSubject$.next(value == key ? "" : key);
      };
      objectDiv.style.background = value == key ? "yellow" : "none";
    });

    if (value == "pickGroup") {
      pickGroupButton.style.background = "yellow";
    } else {
      pickGroupButton.style.background = "rgb(239, 239, 239)";
    }

    if (value == "setGroup") {
      setGroupButton.style.background = "yellow";
    } else {
      setGroupButton.style.background = "rgb(239, 239, 239)";
    }
  });

  selectedGroupUuid$.subscribe((groupUuid) => {
    groupLabel.innerText = `Group ID:\r${groupUuid}`;
  });

  return {
    gridlines: gridLinesInput,
    fps: fpsDiv,
    objects: objectsDiv,
    coordinates: coordinatesDiv,
    layerInspectorDiv,
  };
};

export const loadDebugger = (
  body: HTMLBodyElement,
  gameArea: HTMLDivElement
) => {
  const debug = mountDebugArea(body);

  const renderDebugObject = (debuggable: Debuggable | null) => {
    if (isTree(debuggable)) debuggable.debug.color = "#FFFFFF";
    if (isWall(debuggable)) debuggable.debug.color = "#0b63bb";
    if (isWater(debuggable)) debuggable.debug.color = "#acc896";
    if (isStreet(debuggable)) debuggable.debug.color = "#226e71";
    if (isHouseWall(debuggable)) debuggable.debug.color = "#590e03";
    if (isHouseFloor(debuggable)) debuggable.debug.color = "#7417ed";
    if (isRoof(debuggable)) debuggable.debug.color = "#022efb";
    if (isEmpty(debuggable)) debuggable.debug.color = "rgba(255, 0, 255, 0.5)";
  };

  frame$.pipe(throttleTime(1000)).subscribe((deltaTime) => {
    debug.fps.innerText = `FPS: ${Math.round(1 / deltaTime)}`;
  });

  frameWithGameState$
    .pipe(withLatestFrom(coordinatesToLoadForMyPlayer$))
    .subscribe(([{ gameState }, coordinate]) => {
      const { camera, layerMaps } = gameState;
      const playersArray = Object.values(gameState.players) as Player[];
      const coordinateBounds = getLoadBoundsForCoordinate(coordinate);
      const { interactiveMap, groundMap, passiveMap, overheadMap } = layerMaps;

      let objectsInView = 0;

      for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
        for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
          const renderable = getAtPath(groundMap, x, y);
          if (renderable) {
            renderDebugObject(renderable as any);
            if (withinLens(camera, renderable)) objectsInView++;
          }
        }
      }
      for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
        for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
          const renderable = getAtPath(passiveMap, x, y);
          if (renderable) {
            renderDebugObject(renderable as any);
            if (withinLens(camera, renderable)) objectsInView++;
          }
        }
      }
      for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
        for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
          const renderable = getAtPath(interactiveMap, x, y);
          if (renderable) {
            renderDebugObject(renderable as any);
            if (withinLens(camera, renderable)) objectsInView++;
          }
        }
      }
      for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
        for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
          const renderable = getAtPath(overheadMap, x, y);
          if (renderable) {
            renderDebugObject(renderable as any);
            if (withinLens(camera, renderable)) objectsInView++;
          }
        }
      }

      objectsInView += playersArray.filter((player) =>
        withinLens(camera, player)
      ).length;
      debug.objects.innerText = `Rendered Objects: ${objectsInView}`;
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
      const { worldX, worldY } = offset(camera);
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

  const objectDisplay = (gameObject: GameObject | null) => {
    return `${gameObject?.objectType ?? ""} ${JSON.stringify(gameObject)}`;
  };

  mouseMoveWithNormalizedCoordinate$
    .pipe(withLatestFrom(gameState$))
    .subscribe(([{ x, y }, gameState]) => {
      debug.coordinates.innerText = `Mouse:\r${x},${y}`;

      const interactiveObject = getAtPath(
        gameState.layerMaps.interactiveMap,
        x,
        y
      );
      const overheadObject = getAtPath(gameState.layerMaps.overheadMap, x, y);
      const passiveObject = getAtPath(gameState.layerMaps.passiveMap, x, y);
      const groundObject = getAtPath(gameState.layerMaps.groundMap, x, y);

      let inspectorText = "";

      if (interactiveObject)
        inspectorText += `\r Interactive Layer: ${objectDisplay(
          interactiveObject
        )} \r`;
      if (overheadObject)
        inspectorText += `\r Overhead Layer: ${objectDisplay(
          overheadObject
        )} \r`;
      if (passiveObject)
        inspectorText += `\r Passive Layer: ${objectDisplay(passiveObject)} \r`;
      if (groundObject)
        inspectorText += `\r Ground Layer: ${objectDisplay(groundObject)} \r`;

      debug.layerInspectorDiv.innerText = inspectorText;
    });

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
      filter(
        ({ selectedObject }) =>
          !!objectToSpriteMap[selectedObject as GameObjectType]
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
