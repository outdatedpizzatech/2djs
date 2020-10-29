import {
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from "rxjs/operators";
import { Player } from "../models/player";
import { isDoor } from "../models/door";
import { getAtPath, removeAtPath, setAtPath } from "../coordinate_map";
import {
  clearMapOfObjects,
  updateMapWithObjects,
} from "../reducers/map_reducer";
import { getLoadBoundsForCoordinate } from "../coordinate";
import { generateMap } from "../map_generator";
import {
  aPlayerGoesToMapSubject$,
  coordinatesToLoadForMyPlayerSubject$,
  currentMapIdSubject$,
  gameStateSubject$,
  mapPlaceablesSubject$,
} from "../signals/subjects";
import {
  currentMapId$,
  mapLoadWithState$,
  whenAPlayerGoesToMap$,
} from "../signals/map";
import { whenMyPlayerExceedsDrawDistanceThreshold$ } from "../signals/movement";
import { frameWithGameState$ } from "../signals/frame";
import { socket } from "../sockets";
import { GRID_INTERVAL, PLAYER_GO_TO_MAP } from "../common";
import { gameState$ } from "../signals/game_state";
import { cloneDeep } from "../clone_deep";
import { coordinatesToLoadForMyPlayer$ } from "../signals/my_player";

export const addMapSubscriptions = () => {
  whenAPlayerGoesToMap$
    .pipe(
      withLatestFrom(gameState$),
      map(([{ clientId, mapId, x, y }, gameState]) => ({
        x,
        y,
        mapId,
        gameState,
        clientId,
      })),
      filter(({ clientId, gameState }) => gameState.myClientId == clientId)
    )
    .subscribe(({ mapId, x, y }) => {
      currentMapIdSubject$.next(mapId);
      coordinatesToLoadForMyPlayerSubject$.next({
        x,
        y,
      });
    });

  whenAPlayerGoesToMap$
    .pipe(withLatestFrom(gameState$))
    .subscribe(([{ clientId, mapId, x, y }, gameState]) => {
      const newGameState = cloneDeep(gameState);

      const {
        layerMaps: { interactiveMap },
      } = newGameState;

      const player = newGameState.players[clientId] as Player;

      if (player.clientId == newGameState.myClientId) {
        removeAtPath(interactiveMap, player.x, player.y);
        setAtPath(interactiveMap, x, y, player);
      } else {
        const myPlayer = newGameState.players[
          newGameState.myClientId
        ] as Player;
        if (player.mapId == myPlayer.mapId) {
          removeAtPath(interactiveMap, player.x, player.y);
        }
        if (mapId == myPlayer.mapId) {
          setAtPath(interactiveMap, x, y, player);
        }
      }

      player.mapId = mapId;
      player.x = x;
      player.y = y;
      player.worldX = x * GRID_INTERVAL;
      player.worldY = y * GRID_INTERVAL;

      gameStateSubject$.next(newGameState);
    });

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
    .subscribe(({ gameState }) => {
      socket.emit(PLAYER_GO_TO_MAP, {
        clientId: gameState.myClientId,
        mapId: "100",
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

  coordinatesToLoadForMyPlayer$
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
