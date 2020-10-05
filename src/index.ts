import { cameraFactory } from "./camera";
import {
  coordinatesToLoadForMyPlayer$,
  frameWithGameState$,
  gameState$,
  mapLoadWithState$,
  whenAPlayerFacesDirection$,
  whenAPlayerJoins$,
  whenAPlayerLeaves$,
  whenAPlayerStartsMoving$,
  whenInputtingDirectionToAnUnoccupiedNeighborOfMyPlayer$,
  whenInputtingDirectionWhileMyPlayerIsNotMoving$,
  whenMyPlayerExceedsDrawDistanceThreshold$,
  whenMyPlayerHasMovementDirection$,
  whenMyPlayerHasNotSpawned$,
  whenOtherPlayersAreFacingDirection$,
  whenOtherPlayersHaveJoined$,
  whenOtherPlayersHaveLeft$,
  whenOtherPlayersHaveMovementDirection$,
  whenOtherPlayersStartMoving$,
  whenTheMapIsLoaded$,
} from "./signals";
import { GameState } from "./game_state";
import {
  addPlayer,
  removePlayer,
  updatePlayerMovement,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { Direction, getModsFromDirection } from "./direction";
import { addView } from "./renderers/canvas_renderer";
import { CoordinateMap } from "./coordinate_map";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import {
  API_URI_BASE,
  PLAYER_FACING_DIRECTION,
  PLAYER_JOIN,
  PLAYER_LEAVE,
  PLAYER_MOVE,
  SPAWN_COORDINATE,
} from "./common";
import io from "socket.io-client";
import { Player, playerOnSpawnPoint } from "./models/player";
import { getLoadBoundsForCoordinate } from "./coordinate";
import { Placeable } from "./game_object";
import { updateMapWithObjects } from "./reducers/map_reducer";
import {
  updateFacingDirectionForPlayer,
  updateMovementForPlayer,
} from "./reducers/movement_reducer";
import { cloneDeep } from "lodash";

async function index() {
  const socket = io(API_URI_BASE);
  const bufferCanvas = addView();
  const bufferCtx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const initialGameState: GameState = {
    myClientId: "",
    camera,
    layerMaps: {
      interactableMap: {} as CoordinateMap<Placeable>,
      groundMap: {} as CoordinateMap<Placeable>,
      overheadMap: {} as CoordinateMap<Placeable>,
      passiveMap: {} as CoordinateMap<Placeable>,
    },
    fieldRenderables: [],
    players: {},
  };

  const { visibleCanvas, gameArea, body } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  mapLoadWithState$.subscribe((params) => {
    gameState$.next(updateMapWithObjects(params));
  });

  whenInputtingDirectionToAnUnoccupiedNeighborOfMyPlayer$.subscribe(
    (params) => {
      gameState$.next(updateMovementForPlayer(params));

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
    gameState$.next(updateFacingDirectionForPlayer(params));

    socket.emit(PLAYER_FACING_DIRECTION, {
      clientId: params.player.clientId,
      direction: params.direction,
    });
  });

  frameWithGameState$.subscribe(({ gameState }) => {
    let newGameState = cloneDeep(gameState);
    newGameState = updateCameraPosition(newGameState);
    gameState$.next(newGameState);
  });

  frameWithGameState$.subscribe(({ gameState }) => {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    renderGround(bufferCtx, camera);
    renderAllObjects(bufferCtx, gameState);

    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(bufferCanvas, 0, 0);
  });

  whenMyPlayerHasMovementDirection$.subscribe((params) => {
    let newGameState = cloneDeep(params.gameState);
    newGameState = updatePlayerMovement(
      params.deltaTime,
      newGameState,
      params.player
    );
    gameState$.next(newGameState);
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

    gameState$.next(newGameState);
  });

  whenMyPlayerExceedsDrawDistanceThreshold$.subscribe(({ player }) => {
    coordinatesToLoadForMyPlayer$.next({
      x: player.x,
      y: player.y,
    });
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

  coordinatesToLoadForMyPlayer$.subscribe(async (coordinate) => {
    const coordinateBounds = getLoadBoundsForCoordinate(coordinate);
    const mapPlaceables = await generateMap(coordinateBounds);
    whenTheMapIsLoaded$.next(mapPlaceables);
  });

  whenOtherPlayersHaveJoined$.subscribe((events) => {
    if (events.length > 0) {
      let newGameState = cloneDeep(events[0].gameState);

      events.forEach((event) => {
        newGameState = addPlayer(newGameState, event.player);
      });

      gameState$.next(newGameState);
    }
  });

  whenOtherPlayersHaveLeft$.subscribe((events) => {
    if (events.length > 0) {
      let newGameState = cloneDeep(events[0].gameState);

      events.forEach((event) => {
        newGameState = removePlayer(newGameState, event.clientId);
      });

      gameState$.next(newGameState);
    }
  });

  whenOtherPlayersStartMoving$.subscribe((events) => {
    if (events.length > 0) {
      let newGameState = events[0].gameState;

      events.forEach((event) => {
        const { message } = event;
        const { direction } = message;
        const player = newGameState.players[message.clientId];

        if (player) {
          newGameState =
            updateMovementForPlayer({
              direction,
              player,
              gameState: newGameState,
            }) || newGameState;
        }
      });

      gameState$.next(newGameState);
    }
  });

  whenOtherPlayersAreFacingDirection$.subscribe((events) => {
    if (events.length > 0) {
      let newGameState = events[0].gameState;

      events.forEach((event) => {
        const { message } = event;
        const { direction } = message;
        const player = newGameState.players[message.clientId];

        if (player) {
          newGameState =
            updateFacingDirectionForPlayer({
              direction,
              player,
              gameState: newGameState,
            }) || newGameState;
        }
      });

      gameState$.next(newGameState);
    }
  });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea);
  }

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

  gameState$.next(initialGameState);
}

index();
