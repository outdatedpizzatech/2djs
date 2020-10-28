import { GameState } from "./game_state";
import { renderGameSpace } from "./renderers/game_renderer";
import { addView } from "./renderers/canvas_renderer";
import { renderGround } from "./renderers/ground_renderer";
import { loadDebugger } from "./debug/debugger";
import { renderAllObjects } from "./renderers/render_pipeline/object_renderer";
import { Coordinate } from "./coordinate";
import { addMovementSubscriptions } from "./subscriptions/movement";
import { addSessionsSubscriptions } from "./subscriptions/sessions";
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators";
import deepEqual from "fast-deep-equal";
import { addMapSubscriptions } from "./subscriptions/map";
import { coordinatesToLoadForMyPlayerSubject$ } from "./signals/subjects";
import { frameWithGameState$ } from "./signals/frame";

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
