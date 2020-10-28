import { animationFrameScheduler, interval } from "rxjs";
import { DRAW_DISTANCE, FRAMERATE } from "./common";
import {
  filter,
  map,
  pairwise,
  startWith,
  throttleTime,
  withLatestFrom,
} from "rxjs/operators";
import { Player } from "./models/player";
import { getDistance, getLoadBoundsForCoordinate } from "./coordinate";
import { gameState$ } from "./signals/game_state";
import {
  coordinatesToLoadForMyPlayerSubject$,
  currentMapIdSubject$,
  whenTheMapIsLoaded$,
} from "./signals/subjects";

export const currentMapId$ = currentMapIdSubject$
  .asObservable()
  .pipe(startWith(null));

export const frame$ = interval(1000 / FRAMERATE, animationFrameScheduler).pipe(
  map(() => performance.now()),
  pairwise(),
  map(([previous, current]) => (current - previous) / 1000)
);
export const coordinatesToLoadForMyPlayer$ = coordinatesToLoadForMyPlayerSubject$.asObservable();

export const frameWithGameState$ = frame$.pipe(
  withLatestFrom(gameState$),
  map(([deltaTime, gameState]) => ({
    deltaTime,
    gameState,
  }))
);
export const mapLoadWithState$ = whenTheMapIsLoaded$.pipe(
  withLatestFrom(coordinatesToLoadForMyPlayerSubject$),
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
  withLatestFrom(currentMapId$),
  map(([[{ deltaTime, gameState }, coordinate], currentMapId]) => ({
    deltaTime,
    gameState,
    coordinate,
    player: gameState.players[gameState.myClientId] as Player,
    currentMapId,
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
