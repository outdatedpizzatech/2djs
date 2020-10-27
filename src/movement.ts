import {
  coordinatesToLoadForMyPlayer$,
  coordinatesToLoadForMyPlayerSubject$,
  currentMapId$,
  currentMapIdSubject$,
  frameWithGameState$,
  gameState$,
  gameStateSubject$,
  whenMyPlayerHasMovementDirection$,
} from "./signals";
import {
  updateFacingDirectionForPlayer,
  updateMovementForPlayer,
} from "./reducers/movement_reducer";
import { getModsFromDirection } from "./direction";
import { PLAYER_FACING_DIRECTION, PLAYER_MOVE } from "./common";
import { updatePlayerMovement } from "./reducers/player_reducer";
import {
  whenOtherPlayersAreFacingDirection$,
  whenOtherPlayersHaveMovementDirection$,
  whenOtherPlayersStartMoving$,
} from "./signals/socket";
import { socket } from "./sockets";
import {
  whenInputtingDirectionToAnUnoccupiedNeighborOfMyPlayer$,
  whenInputtingDirectionWhileMyPlayerIsNotMoving$,
} from "./signals/input";
import { cloneDeep } from "./clone_deep";
import {
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from "rxjs/operators";
import { Player } from "./models/player";
import { getAtPath } from "./coordinate_map";
import { isDoor } from "./models/door";
import {
  clearMapOfObjects,
  updateMapWithObjects,
} from "./reducers/map_reducer";

export const addMovementSubscriptions = () => {
  whenInputtingDirectionToAnUnoccupiedNeighborOfMyPlayer$.subscribe(
    (params) => {
      gameStateSubject$.next(updateMovementForPlayer(params));

      const [xMod, yMod] = getModsFromDirection(params.direction);

      socket.emit(PLAYER_MOVE, {
        x: xMod,
        y: yMod,
        clientId: params.player.clientId,
        direction: params.direction,
      });
    }
  );

  whenInputtingDirectionWhileMyPlayerIsNotMoving$.subscribe((params) => {
    gameStateSubject$.next(updateFacingDirectionForPlayer(params));

    socket.emit(PLAYER_FACING_DIRECTION, {
      clientId: params.player.clientId,
      direction: params.direction,
    });
  });

  whenMyPlayerHasMovementDirection$.subscribe((params) => {
    let newGameState = cloneDeep(params.gameState);
    newGameState = updatePlayerMovement(
      params.deltaTime,
      newGameState,
      params.player
    );
    gameStateSubject$.next(newGameState);
  });

  whenOtherPlayersHaveMovementDirection$.subscribe((params) => {
    let newGameState = cloneDeep(params.gameState);

    params.players
      .filter((player) => (player?.movementQueue.length || 0) > 0)
      .forEach((player) => {
        if (player) {
          newGameState = updatePlayerMovement(
            params.deltaTime,
            newGameState,
            player
          );
        }
      });

    gameStateSubject$.next(newGameState);
  });

  whenOtherPlayersStartMoving$.subscribe(({ message, gameState }) => {
    const { direction } = message;
    const player = gameState.players[message.clientId];

    if (player) {
      gameState = updateMovementForPlayer({
        direction,
        player,
        gameState,
      });

      gameStateSubject$.next(gameState);
    }
  });

  whenOtherPlayersAreFacingDirection$.subscribe(({ message, gameState }) => {
    const { direction } = message;
    const player = gameState.players[message.clientId];

    if (player) {
      const newGameState = updateFacingDirectionForPlayer({
        direction,
        player,
        gameState,
      });

      gameStateSubject$.next(newGameState);
    }
  });

  frameWithGameState$
    .pipe(
      map(({ deltaTime, gameState }) => ({
        deltaTime,
        gameState,
        player: gameState.players[gameState.myClientId] as Player,
      })),
      filter(({ player }) => !!player),
      filter(({ player }) => !player.moving),
      map(({ player, gameState }) => ({ x: player.x, y: player.y, gameState })),
      distinctUntilChanged((prev, curr) => prev.x == curr.x && prev.y == curr.y)
    )
    .subscribe(({ x, y, gameState }) => {
      console.log("nump");
      const layer = gameState.layerMaps.passiveMap;

      if (isDoor(getAtPath(layer, x, y))) {
        currentMapIdSubject$.next("100");
        coordinatesToLoadForMyPlayerSubject$.next({
          x: 0,
          y: 0,
        });
      }
    });
};
