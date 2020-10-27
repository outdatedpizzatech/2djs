import {
  animationFrameScheduler,
  combineLatest,
  interval,
  Observable,
  of,
  Subject,
} from "rxjs";
import { DRAW_DISTANCE, FRAMERATE } from "./common";
import {
  filter,
  map,
  pairwise,
  scan,
  startWith,
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
import { Layer } from "./types";
import { cameraFactory } from "./camera";
import { CoordinateMap } from "./coordinate_map";
import { v4 as uuidv4 } from "uuid";

export const currentMapId$: Observable<null> = of(null);

export const selectedEditorObjectSubject$: Subject<string> = new Subject();
export const selectedEditorObject$ = selectedEditorObjectSubject$
  .asObservable()
  .pipe(startWith(""));

export const selectedGroupUuidSubject$: Subject<string> = new Subject();
export const selectedGroupUuid$ = selectedGroupUuidSubject$
  .asObservable()
  .pipe(startWith(uuidv4()));

export const frame$ = interval(1000 / FRAMERATE, animationFrameScheduler).pipe(
  map(() => performance.now()),
  pairwise(),
  map(([previous, current]) => (current - previous) / 1000)
);
export const whenTheMapIsLoaded$ = new Subject<GameObject[]>();
export const coordinatesToLoadForMyPlayerSubject$ = new Subject<{
  x: number;
  y: number;
  mapId: string | null;
}>();
export const coordinatesToLoadForMyPlayer$ = coordinatesToLoadForMyPlayerSubject$.asObservable();
export const gameStateSubject$: Subject<GameState> = new Subject();
const camera = cameraFactory({
  x: 0,
  y: 0,
});

const initialGameState: GameState = {
  myClientId: "",
  camera,
  layerMaps: {
    interactiveMap: {} as CoordinateMap<GameObject>,
    groundMap: {} as CoordinateMap<GameObject>,
    overheadMap: {} as CoordinateMap<GameObject>,
    passiveMap: {} as CoordinateMap<GameObject>,
  },
  players: {},
  debug: {
    layerVisibility: {
      [Layer.INTERACTIVE]: true,
      [Layer.PASSIVE]: true,
      [Layer.GROUND]: true,
      [Layer.OVERHEAD]: true,
    },
    selectedGroupId: null,
  },
};

export const layerVisibility$: Subject<{
  layer: Layer;
  visible: boolean;
}> = new Subject();

export const gameState$ = combineLatest([
  gameStateSubject$,
  layerVisibility$.pipe(
    map(({ layer, visible }) => ({ [layer]: visible })),
    startWith(initialGameState.debug.layerVisibility)
  ),
  selectedGroupUuid$,
]).pipe(
  scan((acc: GameState, [gameState, debugLayer, selectedGroupUuid]) => {
    Object.assign(gameState.debug.layerVisibility, debugLayer);
    gameState.debug.selectedGroupId = selectedGroupUuid;
    return gameState;
  }, initialGameState),
  startWith(initialGameState)
);

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
