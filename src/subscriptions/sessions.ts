import {
  whenOtherPlayersHaveJoined$,
  whenOtherPlayersHaveLeft$,
} from "../signals/socket";
import { addPlayer, removePlayer } from "../reducers/player_reducer";
import {
  coordinatesToLoadForMyPlayerSubject$,
  gameState$,
  gameStateSubject$,
  whenMyPlayerHasNotSpawned$,
} from "../signals";
import { Player, playerOnSpawnPoint } from "../models/player";
import { PLAYER_JOIN, SPAWN_COORDINATE } from "../common";
import { socket } from "../sockets";
import { cloneDeep } from "../clone_deep";

export const addSessionsSubscriptions = () => {
  whenOtherPlayersHaveJoined$.subscribe(({ player, gameState }) => {
    const newGameState = addPlayer(cloneDeep(gameState), player);

    gameStateSubject$.next(newGameState);
  });

  whenOtherPlayersHaveLeft$.subscribe(({ clientId, gameState }) => {
    const newGameState = removePlayer(cloneDeep(gameState), clientId);

    gameStateSubject$.next(newGameState);
  });

  whenMyPlayerHasNotSpawned$.subscribe(async ({ gameState }) => {
    if (await playerOnSpawnPoint()) {
      return;
    }

    let newGameState = cloneDeep(gameState);
    newGameState = addPlayer(newGameState, {
      x: SPAWN_COORDINATE.x,
      y: SPAWN_COORDINATE.y,
      _id: "",
    });
    const player = newGameState.players[newGameState.myClientId] as Player;

    socket.emit(PLAYER_JOIN, player);

    gameStateSubject$.next(newGameState);
    coordinatesToLoadForMyPlayerSubject$.next({
      x: player.x,
      y: player.y,
    });
  });
};
