import { animationFrameScheduler, interval } from "rxjs";
import { FRAMERATE } from "../common";
import { map, pairwise, withLatestFrom } from "rxjs/operators";
import { gameState$ } from "./game_state";

export const frame$ = interval(1000 / FRAMERATE, animationFrameScheduler).pipe(
  map(() => performance.now()),
  pairwise(),
  map(([previous, current]) => (current - previous) / 1000)
);

export const frameWithGameState$ = frame$.pipe(
  withLatestFrom(gameState$),
  map(([deltaTime, gameState]) => ({
    deltaTime,
    gameState,
  }))
);
