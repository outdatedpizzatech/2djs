import {
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from "rxjs/operators";
import { Player } from "../models/player";
import { isDoor } from "../models/door";
import { getAtPath } from "../coordinate_map";
import {
  clearMapOfObjects,
  updateMapWithObjects,
} from "../reducers/map_reducer";
import { getLoadBoundsForCoordinate } from "../coordinate";
import { generateMap } from "../map_generator";
import {
  coordinatesToLoadForMyPlayerSubject$,
  currentMapIdSubject$,
  gameStateSubject$,
  mapPlaceablesSubject$,
} from "../signals/subjects";
import { currentMapId$, mapLoadWithState$ } from "../signals/map";
import { whenMyPlayerExceedsDrawDistanceThreshold$ } from "../signals/movement";
import { frameWithGameState$ } from "../signals/frame";

export const addMapSubscriptions = () => {
  frameWithGameState$
    .pipe(
      map(({ deltaTime, gameState }) => ({
        deltaTime,
        gameState,
        player: gameState.players[gameState.myClientId] as Player,
      })),
      filter(({ player }) => !!player),
      filter(({ player }) => !player.moving),
      map(({ player, gameState }) => ({ x: player.x, y: player.y, gameState })),
      distinctUntilChanged(
        (prev, curr) => prev.x == curr.x && prev.y == curr.y
      ),
      filter(({ x, y, gameState }) => {
        const layer = gameState.layerMaps.passiveMap;

        return isDoor(getAtPath(layer, x, y));
      })
    )
    .subscribe(() => {
      currentMapIdSubject$.next("100");
      coordinatesToLoadForMyPlayerSubject$.next({
        x: 0,
        y: 0,
      });
    });

  mapLoadWithState$.subscribe((params) => {
    gameStateSubject$.next(
      updateMapWithObjects({
        ...params,
        gameState: clearMapOfObjects(params.gameState),
      })
    );
  });

  coordinatesToLoadForMyPlayerSubject$
    .pipe(withLatestFrom(currentMapId$))
    .subscribe(async ([coordinateWithMap, mapId]) => {
      const coordinateBounds = getLoadBoundsForCoordinate(coordinateWithMap);
      const mapPlaceables = await generateMap({
        ...coordinateBounds,
        ...coordinateWithMap,
        ...{ mapId },
      });
      mapPlaceablesSubject$.next(mapPlaceables);
    });

  whenMyPlayerExceedsDrawDistanceThreshold$.subscribe(
    ({ player, currentMapId }) => {
      coordinatesToLoadForMyPlayerSubject$.next({
        x: player.x,
        y: player.y,
      });
    }
  );
};
