import { filter, map, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import { Player, playerFactory, renderPlayer } from "./player";
import { directionForFrame$, frameWithGameState$, gameState$ } from "./signals";
import { GameState } from "./game_state";
import {
  updatePlayerAnimation,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player";
import { updateCameraPosition } from "./reducers/camera";
import { renderGameSpace } from "./game_renderer";
import { renderTree, treeFactory } from "./tree";
import { renderGridLines } from "./debug";

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

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    trees,
  };

  const { debugArea } = renderGameSpace([player, otherPlayer], trees);

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.movementDirection),
      map(([direction, gameState]) =>
        updatePlayerDirection(direction, gameState)
      )
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
      filter(([_, gameState]) => !!gameState.player.movementDirection),
      map(([_, gameState]) => updatePlayerMovement(gameState))
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  // START: debugger config
  // START: debugger config
  if (process.env.DEBUG) {
    frameWithGameState$.subscribe(([_, gameState]) => {
      renderGridLines(debugArea);
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
