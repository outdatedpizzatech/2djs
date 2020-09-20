import { fromEvent, interval, merge, Subject } from "rxjs";
import { FRAMERATE } from "./common";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { getDirectionFromKeyMap, KeyMap } from "./input";
import { GameState } from "./game_state";
import { Direction } from "./direction";

// primitives
const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");

// exportable
export const frame$ = interval(1000 / FRAMERATE);
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
export const directionForFrame$ = keysMapPerFrame$.pipe(
  map(([_, keymap]) => getDirectionFromKeyMap(keymap)),
  filter((direction) => direction != Direction.NONE)
);
export const frameWithGameState$ = frame$.pipe(withLatestFrom(gameState$));
