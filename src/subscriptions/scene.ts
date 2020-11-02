import { frameWithGameState$ } from "../signals/frame";
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators";
import deepEqual from "fast-deep-equal";
import { coordinatesToLoadForMyPlayerSubject$ } from "../signals/subjects";
import { GameState } from "../game_state";
import { Coordinate } from "../coordinate";
import { renderGround } from "../renderers/ground_renderer";
import { renderAllObjects } from "../renderers/render_pipeline/object_renderer";
import { coordinatesToLoadForMyPlayer$ } from "../signals/my_player";
import {currentMapId$} from "../signals/map";

const drawEntireScene = (params: {
  bufferCtx: CanvasRenderingContext2D;
  bufferCanvas: HTMLCanvasElement;
  gameState: GameState;
  visibleCanvas: HTMLCanvasElement;
  visibleCtx: CanvasRenderingContext2D;
  coordinate: Coordinate;
  currentMapId: string | null;
}) => {
  const {
    bufferCanvas,
    gameState,
    coordinate,
    visibleCtx,
    visibleCanvas,
    currentMapId,
  } = params;

  visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);

  if(!currentMapId){
    renderGround(visibleCtx, gameState.camera);
  }
  renderAllObjects(visibleCtx, gameState, coordinate);

  visibleCtx.drawImage(bufferCanvas, 0, 0);
};

export const addSceneSubscriptions = (
  bufferCanvas: HTMLCanvasElement,
  visibleCanvas: HTMLCanvasElement
) => {
  const bufferCtx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;
  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  frameWithGameState$
    .pipe(
      map(({ gameState }) => gameState),
      distinctUntilChanged((p, q) => deepEqual(p, q)),
      withLatestFrom(coordinatesToLoadForMyPlayer$),
      withLatestFrom(currentMapId$),
    )
    .subscribe(([[gameState, coordinate], currentMapId]) => {
      drawEntireScene({
        gameState,
        coordinate,
        bufferCtx,
        bufferCanvas,
        visibleCanvas,
        visibleCtx,
        currentMapId,
      });
    });
};
