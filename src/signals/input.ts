import { fromEvent, merge } from "rxjs";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { getDirectionFromKeyMap, KeyMap } from "../input";
import { frame$, gameState$ } from "../signals";
import { Direction, getModsFromDirection } from "../direction";
import { isPlayer, Player } from "../models/player";
import { getAtPath } from "../coordinate_map";

const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
export const mousemove$ = fromEvent<MouseEvent>(document, "mousemove");
export const mouseup$ = fromEvent<MouseEvent>(document, "mouseup");
export const mousedown$ = fromEvent<MouseEvent>(document, "mousedown");
export const mouse0held$ = merge(
  mousedown$.pipe(
    filter((event) => event.button == 0),
    map(() => true)
  ),
  mouseup$.pipe(
    filter((event) => event.button == 0),
    map(() => false)
  )
);
export const mouse2held$ = merge(
  mousedown$.pipe(
    filter((event) => event.button == 2),
    map(() => true)
  ),
  mouseup$.pipe(
    filter((event) => event.button == 2),
    map(() => false)
  )
);
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

    const foundObject = getAtPath(
      gameState.layerMaps.interactableMap,
      x + xMod,
      y + yMod
    );

    if (!foundObject) {
      return true;
    }

    return isPlayer(foundObject) && foundObject.clientId == player.clientId;
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
