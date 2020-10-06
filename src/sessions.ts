import {
  whenOtherPlayersHaveJoined$,
  whenOtherPlayersHaveLeft$,
} from "./signals/socket";
import { addPlayer, removePlayer } from "./reducers/player_reducer";
import { cloneDeep } from "lodash";
import {
  coordinatesToLoadForMyPlayer$,
  gameState$,
  whenMyPlayerHasNotSpawned$,
} from "./signals";
import { Player, playerOnSpawnPoint } from "./models/player";
import { PLAYER_JOIN, SPAWN_COORDINATE } from "./common";
import { socket } from "./sockets";

export const addSessionsSubscriptions = () => {
  whenOtherPlayersHaveJoined$.subscribe(({ player, gameState }) => {
    const newGameState = addPlayer(cloneDeep(gameState), player);

    gameState$.next(newGameState);
  });

  whenOtherPlayersHaveLeft$.subscribe(({ clientId, gameState }) => {
    const newGameState = removePlayer(cloneDeep(gameState), clientId);

    gameState$.next(newGameState);
  });

  whenMyPlayerHasNotSpawned$.subscribe(async ({ gameState }) => {
    if (await playerOnSpawnPoint()) {
      return;
    }

    let newGameState = cloneDeep(gameState);
    newGameState = addPlayer(newGameState, {
      x: SPAWN_COORDINATE.x,
      y: SPAWN_COORDINATE.y,
    });
    const player = newGameState.players[newGameState.myClientId] as Player;

    socket.emit(PLAYER_JOIN, player);

    gameState$.next(newGameState);
    coordinatesToLoadForMyPlayer$.next({ x: player.x, y: player.y });
  });
};
