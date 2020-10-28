import { Subject } from "rxjs";
import { Player } from "../models/player";
import { Direction } from "../direction";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { gameState$ } from "./game_state";
import { frameWithGameState$ } from "./frame";

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

export const whenOtherPlayersHaveJoined$ = whenAPlayerJoins$.pipe(
  withLatestFrom(gameState$),
  map(([player, gameState]) => ({
    player,
    gameState,
  })),
  filter(({ player, gameState }) => player.clientId !== gameState.myClientId)
);

export const whenOtherPlayersHaveLeft$ = whenAPlayerLeaves$.pipe(
  withLatestFrom(gameState$),
  map(([clientId, gameState]) => ({
    clientId,
    gameState,
  }))
);

export const whenOtherPlayersStartMoving$ = whenAPlayerStartsMoving$.pipe(
  withLatestFrom(gameState$),
  map(([message, gameState]) => ({
    message,
    gameState,
  })),
  filter(({ message, gameState }) => message.clientId !== gameState.myClientId)
);

export const whenOtherPlayersAreFacingDirection$ = whenAPlayerFacesDirection$.pipe(
  withLatestFrom(gameState$),
  map(([message, gameState]) => ({
    message,
    gameState,
  })),
  filter(({ message, gameState }) => message.clientId !== gameState.myClientId)
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
