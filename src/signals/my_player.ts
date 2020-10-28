import { filter, throttleTime } from "rxjs/operators";
import { coordinatesToLoadForMyPlayerSubject$ } from "./subjects";
import { frameWithGameState$ } from "./frame";

export const coordinatesToLoadForMyPlayer$ = coordinatesToLoadForMyPlayerSubject$.asObservable();

export const whenMyPlayerHasNotSpawned$ = frameWithGameState$.pipe(
  throttleTime(1000),
  filter(({ gameState }) => !gameState.players[gameState.myClientId])
);
