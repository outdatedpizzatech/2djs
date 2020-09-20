import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
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
import { Positionable, Renderable } from "./types";
import { getModsFromDirection } from "./direction";
import { renderPlayer } from "./renderers/player_renderer";
import { renderTree } from "./renderers/tree_renderer";
import { isWall, wallFactory } from "./models/wall";
import { renderWall } from "./renderers/wall_renderer";

function index() {
  const player: Player = playerFactory({
    x: 8,
    y: 10,
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

  const wallCoordinates = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [10, 5],
    [11, 5],
    [12, 5],
    [13, 5],
    [14, 5],
    [15, 5],
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

  const fieldRenderables = new Array<Renderable<HTMLCanvasElement>>()
    .concat(trees)
    .concat(walls);

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    coordinateMap,
    fieldRenderables,
  };

  const renderables = new Array<Renderable<HTMLCanvasElement>>()
    .concat([player, otherPlayer])
    .concat(trees)
    .concat(walls);

  const { debugArea } = renderGameSpace(renderables);

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
    renderPlayer(gameState.player, gameState.camera);
    renderPlayer(gameState.otherPlayer, gameState.camera);
    gameState.fieldRenderables.forEach((fieldRenderable) => {
      if (isTree(fieldRenderable)) {
        renderTree(fieldRenderable, gameState.camera);
      }
      if (isWall(fieldRenderable)) {
        renderWall(fieldRenderable, gameState.camera);
      }
    });
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
    renderGridLines(debugArea);

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
