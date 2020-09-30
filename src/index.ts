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
import { GameObject, Layer, Placeable } from "./types";
import { getModsFromDirection } from "./direction";
import { addView } from "./renderers/canvas_renderer";
import { CoordinateMap, getFromCoordinateMap } from "./coordinate_map";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import { BehaviorSubject, Subject } from "rxjs";
import { updateFieldRenderables } from "./reducers/field_renderables_reducer";
import { updateLayerMaps } from "./reducers/layer_reducer";

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

  const mapLoad$ = new Subject<GameObject[]>();

  const coordinateBounds = {
    min: {
      x: -100,
      y: -100,
    },
    max: {
      x: 100,
      y: 100,
    },
  };

  mapLoad$
    .pipe(
      withLatestFrom(gameState$),
      map(([gameObjects, gameState]) =>
        updateFieldRenderables(gameObjects, gameState, coordinateBounds)
      ),
      map(([gameObjects, gameState]) =>
        updateLayerMaps(gameObjects, gameState, coordinateBounds)
      )
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    layerMaps: {
      interactableMap: {} as CoordinateMap<Placeable>,
      groundMap: {} as CoordinateMap<Placeable>,
      overheadMap: {} as CoordinateMap<Placeable>,
      passiveMap: {} as CoordinateMap<Placeable>,
    },
    fieldRenderables: [],
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
    loadDebugger(body, gameArea, [player, otherPlayer]);
  }

  gameState$.next(initialGameState);
  mapLoad$.next([player, otherPlayer]);
  const mapPlaceables = await generateMap(coordinateBounds);
  mapLoad$.next(mapPlaceables);
}

index();
