import {
  coordinatesToLoadForMyPlayerSubject$,
  currentMapIdSubject$,
  mapPlaceablesSubject$,
} from "./subjects";
import { map, startWith, withLatestFrom } from "rxjs/operators";
import { gameState$ } from "./game_state";
import { getLoadBoundsForCoordinate } from "../coordinate";

export const currentMapId$ = currentMapIdSubject$
  .asObservable()
  .pipe(startWith(null));

export const mapLoadWithState$ = mapPlaceablesSubject$.pipe(
  withLatestFrom(coordinatesToLoadForMyPlayerSubject$),
  withLatestFrom(gameState$),
  map(([[gameObjects, coordinate], gameState]) => ({
    gameObjects,
    gameState,
    coordinateBounds: getLoadBoundsForCoordinate(coordinate),
  }))
);
