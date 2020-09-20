import { filter, map, throttleTime, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import { Player, playerFactory } from "./player";
import { directionForFrame$, frameWithGameState$, gameState$ } from "./signals";
import { CoordinateMap, GameState, updateCoordinateMap } from "./game_state";
import {
  updatePlayerAnimation,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { treeFactory } from "./tree";
import { renderGridLines } from "./debug";
import { Positionable } from "./types";
import { getModsFromDirection } from "./direction";
import { renderPlayer } from "./renderers/player_renderer";
import { renderTree } from "./renderers/tree_renderer";

function index() {
  const player: Player = playerFactory({
    x: 0,
    y: 0,
  });

  const otherPlayer: Player = playerFactory({
    x: 12,
    y: 4,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const treeCoordinates = [
    [1, 1],
    [20, 12],
    [40, 4],
    [2, 40],
    [-13, -16],
    [-90, 40],
    [3, 10],
    [14, 5],
  ];

  const trees = treeCoordinates.map((treeCoordinate) =>
    treeFactory({ x: treeCoordinate[0], y: treeCoordinate[1] })
  );

  const players: Positionable[] = [player, otherPlayer];
  const coordinateMap: CoordinateMap = {};
  const occupants: Positionable[] = players.concat(trees);

  occupants.forEach((occupant) => {
    const xRow = coordinateMap[occupant.x] || {};
    xRow[occupant.y] = occupant;
    coordinateMap[occupant.x] = xRow;
  });

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    trees,
    coordinateMap,
  };

  const { debugArea } = renderGameSpace([player, otherPlayer], trees);

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
      map((params) => updatePlayerDirection(...params)),
      map((params) => updateCoordinateMap(...params))
    )
    .subscribe((gameState) => {
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
    gameState.trees.forEach((tree) => {
      renderTree(tree, gameState.camera);
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
  }
  // END: debugger config
  // END: debugger config

  gameState$.next(initialGameState);
}

index();
