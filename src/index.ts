import { filter, map, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import { Player, playerFactory } from "./models/player";
import { directionForFrame$, frameWithGameState$, gameState$ } from "./signals";
import { GameState, updateCoordinateMap } from "./game_state";
import {
  updatePlayerCoordinates,
  updatePlayerFacingDirection,
  updatePlayerMovement,
  updatePlayerMovementDirection,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { Layer, Placeable } from "./types";
import { getModsFromDirection } from "./direction";
import { addView } from "./renderers/canvas_renderer";
import { CoordinateMap, getFromCoordinateMap } from "./coordinate_map";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";

async function index() {
  const buffer = addView();
  const bufferCtx = buffer.getContext("2d") as CanvasRenderingContext2D;

  const player: Player = playerFactory({
    x: 10,
    y: 30,
  });

  const otherPlayer: Player = playerFactory({
    x: 20,
    y: 30,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const mapPlaceables = await generateMap();

  const placeables = new Array<Placeable>()
    .concat([player, otherPlayer])
    .concat(mapPlaceables);

  const groundPlaceables = new Array<Placeable>();
  const passivePlaceables = new Array<Placeable>();
  const interactivePlaceables = new Array<Placeable>();
  const overheadPlaceables = new Array<Placeable>();

  placeables.forEach((placeable) => {
    if (placeable.layer == Layer.GROUND) {
      groundPlaceables.push(placeable);
    }
    if (placeable.layer == Layer.PASSIVE) {
      passivePlaceables.push(placeable);
    }
    if (placeable.layer == Layer.INTERACTIVE) {
      interactivePlaceables.push(placeable);
    }
    if (placeable.layer == Layer.OVERHEAD) {
      overheadPlaceables.push(placeable);
    }
  });

  const interactableMap: CoordinateMap<Placeable> = interactivePlaceables.reduce(
    (acc, placeable) => {
      const xRow = acc[placeable.x] || {};
      xRow[placeable.y] = placeable;
      acc[placeable.x] = xRow;
      return acc;
    },
    {} as CoordinateMap<Placeable>
  );

  const groundMap: CoordinateMap<Placeable> = groundPlaceables.reduce(
    (acc, placeable) => {
      const xRow = acc[placeable.x] || {};
      xRow[placeable.y] = placeable;
      acc[placeable.x] = xRow;
      return acc;
    },
    {} as CoordinateMap<Placeable>
  );

  const passiveMap: CoordinateMap<Placeable> = passivePlaceables.reduce(
    (acc, placeable) => {
      const xRow = acc[placeable.x] || {};
      xRow[placeable.y] = placeable;
      acc[placeable.x] = xRow;
      return acc;
    },
    {} as CoordinateMap<Placeable>
  );

  const overheadMap: CoordinateMap<Placeable> = overheadPlaceables.reduce(
    (acc, placeable) => {
      const xRow = acc[placeable.x] || {};
      xRow[placeable.y] = placeable;
      acc[placeable.x] = xRow;
      return acc;
    },
    {} as CoordinateMap<Placeable>
  );

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    layerMaps: {
      interactableMap,
      groundMap,
      overheadMap,
      passiveMap,
    },
    fieldRenderables: mapPlaceables,
  };

  const { visibleCanvas, gameArea, body } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.movementDirection),
      filter(([direction, gameState]) => {
        const { x, y } = player;
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
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.moving),
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
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

    renderGround(bufferCtx, camera);
    renderAllObjects(bufferCtx, gameState);

    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(buffer, 0, 0);
  });

  frameWithGameState$
    .pipe(
      filter(([_, gameState]) => !!gameState.player.movementDirection),
      map(([deltaTime, gameState]) =>
        updatePlayerMovement(deltaTime, gameState)
      )
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea, [player, otherPlayer], mapPlaceables);
  }

  gameState$.next(initialGameState);
}

index();
