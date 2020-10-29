import {
  API_URI_BASE,
  PLAYER_FACING_DIRECTION,
  PLAYER_GO_TO_MAP,
  PLAYER_JOIN,
  PLAYER_LEAVE,
  PLAYER_MOVE,
} from "./common";
import { Player } from "./models/player";
import {
  whenAPlayerFacesDirection$,
  whenAPlayerJoins$,
  whenAPlayerLeaves$,
  whenAPlayerStartsMoving$,
} from "./signals/socket";
import { Direction } from "./direction";
import io from "socket.io-client";
import { aPlayerGoesToMapSubject$ } from "./signals/subjects";

export const socket = io(API_URI_BASE);

socket.on(PLAYER_JOIN, (player: Player) => {
  whenAPlayerJoins$.next(player);
});

socket.on(
  PLAYER_MOVE,
  (message: {
    x: number;
    y: number;
    clientId: string;
    direction: Direction;
  }) => {
    whenAPlayerStartsMoving$.next(message);
  }
);

socket.on(
  PLAYER_FACING_DIRECTION,
  (message: { clientId: string; direction: Direction }) => {
    whenAPlayerFacesDirection$.next(message);
  }
);

socket.on(PLAYER_LEAVE, (clientId: string) => {
  whenAPlayerLeaves$.next(clientId);
});

socket.on(
  PLAYER_GO_TO_MAP,
  (params: { mapId: string; x: number; y: number; clientId: string }) => {
    aPlayerGoesToMapSubject$.next(params);
  }
);
