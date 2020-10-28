import { filter, map, withLatestFrom } from "rxjs/operators";
import { Player } from "../models/player";
import { getDistance } from "../coordinate";
import { DRAW_DISTANCE } from "../common";
import { currentMapId$ } from "./map";
import { frameWithGameState$ } from "./frame";
import { coordinatesToLoadForMyPlayer$ } from "./my_player";

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
