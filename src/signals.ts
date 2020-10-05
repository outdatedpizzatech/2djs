import {
  animationFrameScheduler,
  fromEvent,
  interval,
  merge,
  Subject,
} from "rxjs";
import { DRAW_DISTANCE, FRAMERATE } from "./common";
import {
  buffer,
  filter,
  map,
  pairwise,
  scan,
  throttleTime,
  withLatestFrom,
} from "rxjs/operators";
import { getDirectionFromKeyMap, KeyMap } from "./input";
import { GameState } from "./game_state";
import { Direction, getModsFromDirection } from "./direction";
import { Player } from "./models/player";
import {
  Coordinate,
  getDistance,
  getLoadBoundsForCoordinate,
} from "./coordinate";
import { GameObject } from "./game_object";
import { getFromCoordinateMap } from "./coordinate_map";

// primitives
const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");

// exportable
export const frame$ = interval(1000 / FRAMERATE, animationFrameScheduler).pipe(
  map(() => performance.now()),
  pairwise(),
  map(([previous, current]) => (current - previous) / 1000)
);
export const whenTheMapIsLoaded$ = new Subject<GameObject[]>();
export const coordinatesToLoadForMyPlayer$ = new Subject<Coordinate>();

// from socket
export const whenAPlayerJoins$ = new Subject<Player>();
export const whenAPlayerLeaves$ = new Subject<string>();
export const whenAPlayerFacesDirection$ = new Subject<{
  clientId: string;
  direction: Direction;
}>();
export const whenAPlayerStartsMoving$ = new Subject<{
  x: number;
  y: number;
  clientId: string;
  direction: Direction;
}>();

export const gameState$: Subject<GameState> = new Subject();

// composites
const keyActions$ = merge(keydown$, keyup$);
const keyMap$ = keyActions$.pipe(
  scan<KeyboardEvent, KeyMap>((acc, val) => {
    acc[val.code] = val.type == "keydown";
    return acc;
  }, {})
);
const keysMapPerFrame$ = frame$.pipe(withLatestFrom(keyMap$));

// exportable
export const inputDirectionForFrame$ = keysMapPerFrame$.pipe(
  map(([_, keymap]) => getDirectionFromKeyMap(keymap)),
  filter((direction) => direction != Direction.NONE)
);
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

export const whenInputtingDirectionToAnUnoccupiedNeighborOfMyPlayer$ = inputDirectionForFrame$.pipe(
  withLatestFrom(gameState$),
  map(([direction, gameState]) => ({
    direction,
    gameState,
    player: gameState.players[gameState.myClientId] as Player,
  })),
  filter(({ player }) => !!player && player.movementQueue.length == 0),
  filter(({ gameState, player, direction }) => {
    if (!player) return false;

    const { x, y } = player;
    const [xMod, yMod] = getModsFromDirection(direction);

    return !getFromCoordinateMap(
      x + xMod,
      y + yMod,
      gameState.layerMaps.interactableMap
    );
  })
);

export const whenInputtingDirectionWhileMyPlayerIsNotMoving$ = inputDirectionForFrame$.pipe(
  withLatestFrom(gameState$),
  map(([direction, gameState]) => ({
    direction,
    gameState,
    player: gameState.players[gameState.myClientId] as Player,
  })),
  filter(({ player }) => !!player),
  filter(({ player }) => !player.moving)
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
    return distance > DRAW_DISTANCE;
  })
);

export const whenMyPlayerHasNotSpawned$ = frameWithGameState$.pipe(
  throttleTime(1000),
  filter(({ gameState }) => !gameState.players[gameState.myClientId])
);

export const whenOtherPlayersHaveJoined$ = whenAPlayerJoins$.pipe(
  withLatestFrom(gameState$),
  map(([player, gameState]) => ({
    player,
    gameState,
  })),
  filter(({ player, gameState }) => player.clientId !== gameState.myClientId),
  buffer(frame$)
);

export const whenOtherPlayersHaveLeft$ = whenAPlayerLeaves$.pipe(
  withLatestFrom(gameState$),
  map(([clientId, gameState]) => ({
    clientId,
    gameState,
  })),
  buffer(frame$)
);

export const whenOtherPlayersStartMoving$ = whenAPlayerStartsMoving$.pipe(
  withLatestFrom(gameState$),
  map(([message, gameState]) => ({
    message,
    gameState,
  })),
  filter(({ message, gameState }) => message.clientId !== gameState.myClientId),
  buffer(frame$)
);

export const whenOtherPlayersAreFacingDirection$ = whenAPlayerFacesDirection$.pipe(
  withLatestFrom(gameState$),
  map(([message, gameState]) => ({
    message,
    gameState,
  })),
  filter(({ message, gameState }) => message.clientId !== gameState.myClientId),
  buffer(frame$)
);

export const whenOtherPlayersHaveMovementDirection$ = frameWithGameState$.pipe(
  map(({ deltaTime, gameState }) => ({
    deltaTime,
    gameState,
    players: Object.values(gameState.players).filter(
      (player) => player?.clientId != gameState.myClientId
    ),
  }))
);
