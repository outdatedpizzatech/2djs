import {
  buffer,
  filter,
  map,
  throttleTime,
  withLatestFrom,
} from "rxjs/operators";
import { cameraFactory } from "./camera";
import {
  directionForFrame$,
  frame$,
  frameWithGameState$,
  gameState$,
} from "./signals";
import { GameState, updateCoordinateMap } from "./game_state";
import {
  addPlayer,
  updatePlayerCoordinates,
  updatePlayerFacingDirection,
  updatePlayerMovement,
  updatePlayerMovementDirection,
  updatePlayers,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { Coordinate, CoordinateBounds, GameObject, Placeable } from "./types";
import { getModsFromDirection } from "./direction";
import { addView } from "./renderers/canvas_renderer";
import { CoordinateMap, getFromCoordinateMap } from "./coordinate_map";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import { Subject } from "rxjs";
import { updateFieldRenderables } from "./reducers/field_renderables_reducer";
import { updateLayerMaps } from "./reducers/layer_reducer";
import { DRAW_DISTANCE } from "./common";
import io from "socket.io-client";
import axios from "axios";
import { Player } from "./models/player";

const SPAWN_COORDINATE = {
  x: 10,
  y: 30,
};

async function index() {
  const socket = io("http://localhost:9000");
  const bufferCanvas = addView();
  const bufferCtx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const getLoadBoundsForCoordinate = (
    coordinate: Coordinate
  ): CoordinateBounds => {
    return {
      min: {
        x: coordinate.x - DRAW_DISTANCE,
        y: coordinate.y - DRAW_DISTANCE,
      },
      max: {
        x: coordinate.x + DRAW_DISTANCE,
        y: coordinate.y + DRAW_DISTANCE,
      },
    };
  };

  const getDistance = (coordinate1: Coordinate, coordinate2: Coordinate) => {
    const { x: x1, y: y1 } = coordinate1;
    const { x: x2, y: y2 } = coordinate2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const mapLoad$ = new Subject<GameObject[]>();
  const loadCoordinate$ = new Subject<Coordinate>();
  const playerJoin$ = new Subject<Player>();

  mapLoad$
    .pipe(
      withLatestFrom(loadCoordinate$),
      withLatestFrom(gameState$),
      map(([[gameObjects, coordinate], gameState]) =>
        updateFieldRenderables(
          gameObjects,
          gameState,
          getLoadBoundsForCoordinate(coordinate)
        )
      ),
      map(([gameObjects, gameState, coordinateBounds]) =>
        updatePlayers(gameObjects, gameState, coordinateBounds)
      ),
      map(([gameObjects, gameState, coordinateBounds]) =>
        updateLayerMaps(gameObjects, gameState, coordinateBounds)
      )
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  const initialGameState: GameState = {
    myPlayer: null,
    camera,
    layerMaps: {
      interactableMap: {} as CoordinateMap<Placeable>,
      groundMap: {} as CoordinateMap<Placeable>,
      overheadMap: {} as CoordinateMap<Placeable>,
      passiveMap: {} as CoordinateMap<Placeable>,
    },
    fieldRenderables: [],
    players: [],
  };

  const { visibleCanvas, gameArea, body } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, { myPlayer }]) => !!myPlayer && !myPlayer.movementDirection),
      filter(([direction, gameState]) => {
        if (!gameState.myPlayer) {
          return false;
        }

        const { x, y } = gameState.myPlayer;
        const [xMod, yMod] = getModsFromDirection(direction);

        return !getFromCoordinateMap(
          x + xMod,
          y + yMod,
          gameState.layerMaps.interactableMap
        );
      }),
      map((params) => updateCoordinateMap(...params)),
      map((params) => updatePlayerCoordinates(...params)),
      map((params) => updatePlayerMovementDirection(...params))
    )
    .subscribe(([direction, gameState]) => {
      const [xMod, yMod] = getModsFromDirection(direction);
      socket.emit("PLAYER_MOVE", {
        x: xMod,
        y: yMod,
        clientId: gameState.myPlayer?.clientId,
      });
      gameState$.next(gameState);
    });

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, { myPlayer }]) => !!myPlayer && !myPlayer.moving),
      map((params) => updatePlayerFacingDirection(...params))
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  frameWithGameState$
    .pipe(map(([_, gameState]) => updateCameraPosition(gameState)))
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  frameWithGameState$.subscribe(([_, gameState]) => {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    renderGround(bufferCtx, camera);
    renderAllObjects(bufferCtx, gameState);

    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(bufferCanvas, 0, 0);
  });

  frameWithGameState$
    .pipe(
      filter(([_, { myPlayer }]) => !!myPlayer && !!myPlayer.movementDirection),
      map(([deltaTime, gameState]) =>
        updatePlayerMovement(deltaTime, gameState)
      )
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  frameWithGameState$
    .pipe(
      withLatestFrom(loadCoordinate$),
      filter(([[_, { myPlayer }], coordinate]) => {
        if (!myPlayer) {
          return false;
        }

        const distance = getDistance(myPlayer, coordinate);
        return distance > DRAW_DISTANCE;
      })
    )
    .subscribe(([[_, { myPlayer }], _c]) => {
      if (myPlayer) {
        loadCoordinate$.next({
          x: myPlayer.x,
          y: myPlayer.y,
        });
      }
    });

  frameWithGameState$
    .pipe(
      throttleTime(1000),
      filter(([_, { myPlayer }]) => !myPlayer),
      map(([_, gameState]) =>
        addPlayer(gameState, SPAWN_COORDINATE.x, SPAWN_COORDINATE.y)
      )
    )
    .subscribe(async (gameState) => {
      const result = await axios.get("http://localhost:9000/players");
      const occupyingPlayer = result.data.find(
        (player: any) =>
          SPAWN_COORDINATE.x == player.x && SPAWN_COORDINATE.y == player.y
      );
      if (!occupyingPlayer) {
        gameState$.next(gameState);
        const { myPlayer } = gameState;
        if (myPlayer) {
          socket.emit("PLAYER_JOIN", myPlayer);
          loadCoordinate$.next({ x: myPlayer.x, y: myPlayer.y });
        }
      }
    });

  loadCoordinate$.subscribe(async (coordinate) => {
    const coordinateBounds = getLoadBoundsForCoordinate(coordinate);
    const mapPlaceables = await generateMap(coordinateBounds);
    mapLoad$.next(mapPlaceables);
  });

  playerJoin$
    .pipe(
      withLatestFrom(gameState$),
      filter(
        ([player, gameState], _) =>
          player.clientId !== gameState.myPlayer?.clientId
      ),
      buffer(frame$)
    )
    .subscribe((events) => {
      if (events.length > 0) {
        let gameState = events[0][1];

        events.forEach((event) => {
          gameState = addPlayer(event[1], event[0].x, event[0].y);
        });

        gameState$.next(gameState);
      }
    });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea);
  }

  socket.on("PLAYER_JOIN", (player: Player) => {
    playerJoin$.next(player);
  });

  gameState$.next(initialGameState);
}

index();
