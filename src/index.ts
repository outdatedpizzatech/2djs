import {
  coordinatesToLoadForMyPlayerSubject$,
  currentMapId$,
  frameWithGameState$,
  gameStateSubject$,
  mapLoadWithState$,
  whenMyPlayerExceedsDrawDistanceThreshold$,
  whenTheMapIsLoaded$,
} from "./signals";
import { GameState } from "./game_state";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { addView } from "./renderers/canvas_renderer";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { generateMap } from "./map_generator";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import { Coordinate, getLoadBoundsForCoordinate } from "./coordinate";
import {
  clearMapOfObjects,
  updateMapWithObjects,
} from "./reducers/map_reducer";
import { addMovementSubscriptions } from "./subscriptions/movement";
import { addSessionsSubscriptions } from "./subscriptions/sessions";
import { cloneDeep } from "./clone_deep";
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators";
import deepEqual from "fast-deep-equal";
import { addMapSubscriptions } from "./subscriptions/map";
import { addCameraSubscriptions } from "./subscriptions/camera";

const drawEntireScene = (params: {
  bufferCtx: CanvasRenderingContext2D;
  bufferCanvas: HTMLCanvasElement;
  gameState: GameState;
  visibleCanvas: HTMLCanvasElement;
  visibleCtx: CanvasRenderingContext2D;
  coordinate: Coordinate;
}) => {
  const {
    bufferCanvas,
    gameState,
    coordinate,
    visibleCtx,
    visibleCanvas,
  } = params;

  visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);

  renderGround(visibleCtx, gameState.camera);
  renderAllObjects(visibleCtx, gameState, coordinate);

  visibleCtx.drawImage(bufferCanvas, 0, 0);
};

async function index() {
  const bufferCanvas = addView();
  const bufferCtx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

  const { visibleCanvas, gameArea, body } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  addMapSubscriptions();
  addMovementSubscriptions();
  addSessionsSubscriptions();
  addCameraSubscriptions();

  frameWithGameState$
    .pipe(
      map(({ gameState }) => gameState),
      distinctUntilChanged((p, q) => deepEqual(p, q)),
      withLatestFrom(coordinatesToLoadForMyPlayerSubject$)
    )
    .subscribe(([gameState, coordinate]) => {
      drawEntireScene({
        gameState,
        coordinate,
        bufferCtx,
        bufferCanvas,
        visibleCanvas,
        visibleCtx,
      });
    });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea);
  }
}

index();
