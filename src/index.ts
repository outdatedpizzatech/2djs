import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { CAMERA_HEIGHT, CAMERA_WIDTH, cameraFactory } from "./camera";
import { Player, playerFactory } from "./models/player";
import { directionForFrame$, frameWithGameState$, gameState$ } from "./signals";
import { CoordinateMap, GameState, updateCoordinateMap } from "./game_state";
import {
  updatePlayerAnimation,
  updatePlayerCoordinates,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { isTree, treeFactory } from "./models/tree";
import { renderGridLines } from "./debug";
import { Positionable } from "./types";
import { getModsFromDirection } from "./direction";
import { renderPlayer } from "./renderers/player_renderer";
import { renderTree } from "./renderers/tree_renderer";
import { isWall, wallFactory } from "./models/wall";
import { renderWall } from "./renderers/wall_renderer";
import { addView } from "./renderers/canvas_renderer";
import { fromEvent } from "rxjs";

function index() {
  const buffer = addView();
  const bufferCtx = buffer.getContext("2d") as CanvasRenderingContext2D;

  const player: Player = playerFactory({
    x: -20,
    y: -20,
  });

  const otherPlayer: Player = playerFactory({
    x: 9,
    y: -5,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const treeCoordinates = [];
  for (let i = 0; i < 80; i++) {
    if (i != 40) {
      for (let a = 0; a < 50; a++) {
        treeCoordinates.push([i, a]);
      }
    }
  }

  const wallCoordinates = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [11, 5],
    [12, 5],
    [13, 5],
    [14, 5],
    [15, 5],
    [16, 5],
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
    [0, -1],
    [-1, -1],
    [-2, -1],
    [-3, -1],
    [-4, -1],
    [-5, -1],
    [-6, -1],
    [-7, -1],
    [-7, -2],
    [-7, -3],
    [-7, -4],
    [-7, -5],
    [-7, -6],
    [-7, -7],
    [-7, -8],
    [-7, -9],
    [-7, -10],
    [-7, -11],
    [-7, -12],
    [-7, -13],
    [-7, -14],
    [-7, -15],
    [-7, -16],
  ];

  const trees = treeCoordinates.map((treeCoordinate) =>
    treeFactory({ x: treeCoordinate[0], y: treeCoordinate[1] })
  );

  const walls = wallCoordinates.map((wallCoordinate) =>
    wallFactory({ x: wallCoordinate[0], y: wallCoordinate[1] })
  );

  const positionables = new Array<Positionable>()
    .concat([player, otherPlayer])
    .concat(trees)
    .concat(walls);

  const coordinateMap: CoordinateMap = positionables.reduce(
    (acc, positionable) => {
      const xRow = acc[positionable.x] || {};
      xRow[positionable.y] = positionable;
      acc[positionable.x] = xRow;
      return acc;
    },
    {} as CoordinateMap
  );

  positionables.forEach((positionable) => {
    const xRow = coordinateMap[positionable.x] || {};
    xRow[positionable.y] = positionable;
    coordinateMap[positionable.x] = xRow;
  });

  const fieldRenderables = new Array<any>().concat(trees).concat(walls);

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    coordinateMap,
    fieldRenderables,
  };

  const { visibleCanvas, gameArea, debug } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.movementDirection),
      filter(([direction, gameState]) => {
        const { x, y } = player;

        const [xMod, yMod] = getModsFromDirection(direction);

        const xRow = gameState.coordinateMap[x + xMod] || {};
        return !xRow[y + yMod];
      }),
      map((params) => updateCoordinateMap(...params)),
      map((params) => updatePlayerCoordinates(...params)),
      map((params) => updatePlayerDirection(...params))
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  frameWithGameState$
    .pipe(
      map(([_, gameState]) => updateCameraPosition(gameState)),
      map(updatePlayerAnimation)
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  frameWithGameState$.subscribe(([_, gameState]) => {
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

    const { player, otherPlayer, camera, fieldRenderables } = gameState;

    renderPlayer(player, camera, bufferCtx);

    if (camera.withinLens(otherPlayer)) {
      renderPlayer(otherPlayer, camera, bufferCtx);
    }

    fieldRenderables.forEach((renderable) => {
      if (camera.withinLens(renderable)) {
        if (isTree(renderable)) {
          renderTree(renderable, camera, bufferCtx);
        }
        if (isWall(renderable)) {
          renderWall(renderable, camera, bufferCtx);
        }
      }
    });

    visibleCtx.fillStyle = "green";
    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(buffer, 0, 0);
  });

  frameWithGameState$
    .pipe(
      map(([_, gameState]) => gameState),
      filter((gameState) => !!gameState.player.movementDirection),
      map(updatePlayerMovement)
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  // START: debugger config
  // START: debugger config
  if (process.env.DEBUG) {
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
    player.debug.color = "red";
    otherPlayer.debug.color = "blue";
    trees.forEach((tree) => {
      tree.debug.color = "white";
    });
    walls.forEach((wall) => {
      wall.debug.color = "yellow";
    });
  }
  // END: debugger config
  // END: debugger config

  gameState$.next(initialGameState);
}

index();
