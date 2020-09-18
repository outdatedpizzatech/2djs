import { fromEvent, interval, merge, Subject } from "rxjs";
import { Direction, FRAMERATE } from "./common";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { getDirectionFromKeyMap, KeyMap } from "./input";

export const frame$ = interval(1000 / FRAMERATE);
export const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
export const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
export const keyActions$ = merge(keydown$, keyup$);
export const keyMap$ = keyActions$.pipe(
  scan<KeyboardEvent, KeyMap>((acc, val) => {
    acc[val.code] = val.type == "keydown";
    return acc;
  }, {})
);
export const keysMapPerFrame$ = frame$.pipe(withLatestFrom(keyMap$));

export const directionForFrame$ = keysMapPerFrame$.pipe(
  map(([_, keymap]) => getDirectionFromKeyMap(keymap)),
  filter((direction) => direction != Direction.NONE)
);
