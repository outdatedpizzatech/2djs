import { cameraFactory } from "./camera";
import {
  coordinatesToLoadForMyPlayer$,
  frameWithGameState$,
  gameState$,
  mapLoadWithState$,
  whenMyPlayerExceedsDrawDistanceThreshold$,
  whenTheMapIsLoaded$,
} from "./signals";
import { GameState } from "./game_state";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { addView } from "./renderers/canvas_renderer";
import { CoordinateMap } from "./coordinate_map";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import { getLoadBoundsForCoordinate } from "./coordinate";
import { Placeable } from "./game_object";
import { updateMapWithObjects } from "./reducers/map_reducer";
import { cloneDeep } from "lodash";
import { addMovementSubscriptions } from "./movement";
import { addSessionsSubscriptions } from "./sessions";

async function index() {
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

  addMovementSubscriptions();
  addSessionsSubscriptions();

  mapLoadWithState$.subscribe((params) => {
    gameState$.next(updateMapWithObjects(params));
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

  whenMyPlayerExceedsDrawDistanceThreshold$.subscribe(({ player }) => {
    coordinatesToLoadForMyPlayer$.next({
      x: player.x,
      y: player.y,
    });
  });

  coordinatesToLoadForMyPlayer$.subscribe(async (coordinate) => {
    const coordinateBounds = getLoadBoundsForCoordinate(coordinate);
    const mapPlaceables = await generateMap(coordinateBounds);
    whenTheMapIsLoaded$.next(mapPlaceables);
  });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea);
  }

  gameState$.next(initialGameState);
}

index();
