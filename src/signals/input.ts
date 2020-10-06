import { fromEvent, merge } from "rxjs";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { getDirectionFromKeyMap, KeyMap } from "../input";
import { frame$, gameState$ } from "../signals";
import { Direction, getModsFromDirection } from "../direction";
import { Player } from "../models/player";
import { getFromCoordinateMap } from "../coordinate_map";

const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
const keyActions$ = merge(keydown$, keyup$);
const keyMap$ = keyActions$.pipe(
  scan<KeyboardEvent, KeyMap>((acc, val) => {
    acc[val.code] = val.type == "keydown";
    return acc;
  }, {})
);
const keysMapPerFrame$ = frame$.pipe(withLatestFrom(keyMap$));
export const inputDirectionForFrame$ = keysMapPerFrame$.pipe(
  map(([_, keymap]) => getDirectionFromKeyMap(keymap)),
  filter((direction) => direction != Direction.NONE)
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
