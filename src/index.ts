import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import {
  decideCurrentAnimation,
  nextAnimationFrame,
  Player,
  playerFactory,
  renderPlayer,
} from "./player";
import {
  directionForFrame$,
  frame$,
  frameWithGameState$,
  gameState$,
} from "./signals";
import { GameState } from "./game_state";
import {
  updatePlayerAnimation,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player";
import { updateCameraPosition } from "./reducers/camera";
import { renderGameSpace } from "./game_renderer";

function index() {
  const player: Player = playerFactory({
    color: "red",
    x: 0,
    y: 0,
  });

  const otherPlayer: Player = playerFactory({
    color: "blue",
    x: 192,
    y: 64,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
  };

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
  });

  frameWithGameState$
    .pipe(
      filter(([_, gameState]) => !!gameState.player.movementDirection),
      map(([_, gameState]) => updatePlayerMovement(gameState))
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  gameState$.next(initialGameState);

  renderGameSpace([player, otherPlayer]);
}

index();
