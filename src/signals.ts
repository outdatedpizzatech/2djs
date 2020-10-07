import { animationFrameScheduler, interval, Subject } from "rxjs";
import { DRAW_DISTANCE, FRAMERATE } from "./common";
import {
  filter,
  map,
  pairwise,
  throttleTime,
  withLatestFrom,
} from "rxjs/operators";
import { GameState } from "./game_state";
import { Player } from "./models/player";
import {
  Coordinate,
  getDistance,
  getLoadBoundsForCoordinate,
} from "./coordinate";
import { GameObject } from "./game_object";

export const frame$ = interval(1000 / FRAMERATE, animationFrameScheduler).pipe(
  map(() => performance.now()),
  pairwise(),
  map(([previous, current]) => (current - previous) / 1000)
);
export const whenTheMapIsLoaded$ = new Subject<GameObject[]>();
export const coordinatesToLoadForMyPlayer$ = new Subject<Coordinate>();
export const gameState$: Subject<GameState> = new Subject();

export const frameWithGameState$ = frame$.pipe(
  withLatestFrom(gameState$),
  map(([deltaTime, gameState]) => ({
    deltaTime,
    gameState,
  }))
);
export const mapLoadWithState$ = whenTheMapIsLoaded$.pipe(
  withLatestFrom(coordinatesToLoadForMyPlayer$),
  withLatestFrom(gameState$),
  map(([[gameObjects, coordinate], gameState]) => ({
    gameObjects,
    gameState,
    coordinateBounds: getLoadBoundsForCoordinate(coordinate),
  }))
);

export const whenMyPlayerHasMovementDirection$ = frameWithGameState$.pipe(
  map(({ deltaTime, gameState }) => ({
    deltaTime,
    gameState,
    player: gameState.players[gameState.myClientId] as Player,
  })),
  filter(({ player }) => !!player),
  filter(({ player }) => player.movementQueue.length > 0)
);

export const whenMyPlayerExceedsDrawDistanceThreshold$ = frameWithGameState$.pipe(
  withLatestFrom(coordinatesToLoadForMyPlayer$),
  map(([{ deltaTime, gameState }, coordinate]) => ({
    deltaTime,
    gameState,
    coordinate,
    player: gameState.players[gameState.myClientId] as Player,
  })),
  filter(({ player }) => !!player),
  filter(({ player, coordinate }) => {
    const distance = getDistance(player, coordinate);
    return distance > DRAW_DISTANCE / 2;
  })
);

export const whenMyPlayerHasNotSpawned$ = frameWithGameState$.pipe(
  throttleTime(1000),
  filter(({ gameState }) => !gameState.players[gameState.myClientId])
);
