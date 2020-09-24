import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { CAMERA_HEIGHT, CAMERA_WIDTH, cameraFactory } from "./camera";
import { Player, playerFactory } from "./models/player";
import {
  directionForFrame$,
  frame$,
  frameWithGameState$,
  gameState$,
} from "./signals";
import { GameState, updateCoordinateMap } from "./game_state";
import {
  updatePlayerCoordinates,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { Tree, treeFactory } from "./models/tree";
import { renderGridLines } from "./debug";
import { Placeable, Positionable } from "./types";
import { getModsFromDirection } from "./direction";
import { Wall, wallFactory } from "./models/wall";
import { addView } from "./renderers/canvas_renderer";
import { fromEvent } from "rxjs";
import { renderFieldRenderables } from "./render_pipeline";
import { CoordinateMap, getFromCoordinateMap } from "./coordinate_map";
import corneriaMap from "./maps/corneria.txt";
import { Water, waterFactory } from "./models/water";
import { Street, streetFactory } from "./models/street";

function index() {
  const buffer = addView();
  const bufferCtx = buffer.getContext("2d") as CanvasRenderingContext2D;

  const player: Player = playerFactory({
    x: 10,
    y: 30,
  });

  const otherPlayer: Player = playerFactory({
    x: 20,
    y: 30,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  let walls = new Array<Wall>();
  let trees = new Array<Tree>();
  let waters = new Array<Water>();
  let streets = new Array<Street>();

  (corneriaMap as string).split(/\n/).forEach((line, y) => {
    line.split("").forEach((code, x) => {
      if (code == "x") {
        walls.push(wallFactory({ x, y }));
      }
      if (code == "l") {
        trees.push(treeFactory({ x, y }));
      }
      if (code == "o") {
        waters.push(waterFactory({ x, y }));
      }
      if (code == "m") {
        streets.push(streetFactory({ x, y }));
      }
    });
  });

  const positionables = new Array<Placeable>()
    .concat([player, otherPlayer])
    .concat(trees)
    .concat(waters)
    .concat(streets)
    .concat(walls);

  const coordinateMap: CoordinateMap<Positionable> = positionables
    .filter((positionable) => !positionable.passable)
    .reduce((acc, positionable) => {
      const xRow = acc[positionable.x] || {};
      xRow[positionable.y] = positionable;
      acc[positionable.x] = xRow;
      return acc;
    }, {} as CoordinateMap<Positionable>);

  const fieldRenderables = new Array<any>()
    .concat(trees)
    .concat(walls)
    .concat(streets)
    .concat(waters);

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    collisionMap: coordinateMap,
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

        return !getFromCoordinateMap(
          x + xMod,
          y + yMod,
          gameState.collisionMap
        );
      }),
      map((params) => updateCoordinateMap(...params)),
      map((params) => updatePlayerCoordinates(...params)),
      map((params) => updatePlayerDirection(...params))
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  frameWithGameState$
    .pipe(map(([_, gameState]) => updateCameraPosition(gameState)))
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  frameWithGameState$.subscribe(([_, gameState]) => {
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

    renderFieldRenderables(bufferCtx, gameState);

    visibleCtx.fillStyle = "green";
    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(buffer, 0, 0);
  });

  frameWithGameState$
    .pipe(
      filter(([_, gameState]) => !!gameState.player.movementDirection),
      map(([deltaTime, gameState]) =>
        updatePlayerMovement(deltaTime, gameState)
      )
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  // START: debugger config
  // START: debugger config
  if (process.env.DEBUG) {
    if (debug) {
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
      player.debug.color = "red";
      otherPlayer.debug.color = "blue";
      trees.forEach((tree) => {
        tree.debug.color = "white";
      });
      walls.forEach((wall) => {
        wall.debug.color = "yellow";
      });
      waters.forEach((water) => {
        water.debug.color = "black";
      });
      streets.forEach((street) => {
        street.debug.color = "#DDDDDD";
      });
    }
  }
  // END: debugger config
  // END: debugger config

  gameState$.next(initialGameState);
}

index();
