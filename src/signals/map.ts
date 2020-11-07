import {aPlayerGoesToMapSubject$, currentMapIdSubject$, mapPlaceablesSubject$,} from "./subjects";
import {map, startWith, withLatestFrom} from "rxjs/operators";
import {gameState$} from "./game_state";
import {getLoadBoundsForCoordinate} from "../coordinate";
import {coordinatesToLoadForMyPlayer$} from "./my_player";

export const currentMapId$ = currentMapIdSubject$
  .asObservable()
  .pipe(startWith(null));

export const mapLoadWithState$ = mapPlaceablesSubject$.pipe(
  withLatestFrom(coordinatesToLoadForMyPlayer$),
  withLatestFrom(gameState$),
  map(([[gameObjects, coordinate], gameState]) => ({
    gameObjects,
    gameState,
    coordinateBounds: getLoadBoundsForCoordinate(coordinate),
  }))
);

export const whenAPlayerGoesToMap$ = aPlayerGoesToMapSubject$.asObservable();
