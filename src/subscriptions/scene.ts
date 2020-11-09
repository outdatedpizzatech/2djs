import { frameWithGameState$ } from "../signals/frame";
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators";
import deepEqual from "fast-deep-equal";
import { coordinatesToLoadForMyPlayerSubject$ } from "../signals/subjects";
import { GameState } from "../game_state";
import { Coordinate } from "../coordinate";
import { renderGround } from "../renderers/ground_renderer";
import { renderAllObjects } from "../renderers/render_pipeline/object_renderer";
import { coordinatesToLoadForMyPlayer$ } from "../signals/my_player";
import { currentMapId$ } from "../signals/map";
import { transitionPercent$ } from "../signals/transition";
import { RenderDictionary } from "../renderers/render_dictionary";

const drawEntireSceneToBuffer = (params: {
  bufferCanvas: HTMLCanvasElement;
  bufferCtx: CanvasRenderingContext2D;
  tempCtx: CanvasRenderingContext2D;
  gameState: GameState;
  coordinate: Coordinate;
  currentMapId: string | null;
  transitionPercent: number;
  renderDictionary: RenderDictionary;
}) => {
  const {
    gameState,
    coordinate,
    bufferCtx,
    tempCtx,
    currentMapId,
    bufferCanvas,
    transitionPercent,
    renderDictionary,
  } = params;

  if (transitionPercent == 0 || transitionPercent == 1) {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    if (!currentMapId) {
      renderGround(bufferCtx, gameState.camera);
    }
    renderAllObjects(
      bufferCtx,
      gameState,
      coordinate,
      tempCtx,
      renderDictionary
    );
  }
};

const drawEntireSceneToVisible = (params: {
  bufferCtx: CanvasRenderingContext2D;
  bufferCanvas: HTMLCanvasElement;
  visibleCanvas: HTMLCanvasElement;
  visibleCtx: CanvasRenderingContext2D;
  transitionPercent: number;
}) => {
  const { bufferCanvas, visibleCtx, visibleCanvas, transitionPercent } = params;

  visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);

  visibleCtx.globalAlpha = transitionPercent;
  visibleCtx.drawImage(bufferCanvas, 0, 0);
};

export const addSceneSubscriptions = (
  bufferCanvas: HTMLCanvasElement,
  visibleCanvas: HTMLCanvasElement,
  tempCanvas: HTMLCanvasElement,
  renderDictionary: RenderDictionary
) => {
  const bufferCtx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;
  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;
  const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;

  frameWithGameState$
    .pipe(
      withLatestFrom(transitionPercent$),
      map(([{ gameState }, transitionPercent]) => ({
        gameState,
        transitionPercent,
      })),
      distinctUntilChanged(
        (p, q) =>
          deepEqual(p.gameState, q.gameState) &&
          p.transitionPercent == q.transitionPercent
      ),
      withLatestFrom(coordinatesToLoadForMyPlayer$),
      map(([{ gameState, transitionPercent }, coordinate]) => ({
        transitionPercent,
        gameState,
        coordinate,
      })),
      withLatestFrom(currentMapId$),
      map(([{ transitionPercent, gameState, coordinate }, currentMapId]) => ({
        gameState,
        transitionPercent,
        coordinate,
        currentMapId,
      }))
    )
    .subscribe(({ gameState, coordinate, currentMapId, transitionPercent }) => {
      drawEntireSceneToBuffer({
        gameState,
        coordinate,
        bufferCanvas,
        bufferCtx,
        tempCtx,
        currentMapId,
        transitionPercent,
        renderDictionary,
      });
    });

  frameWithGameState$
    .pipe(
      withLatestFrom(transitionPercent$),
      map(([_, transitionPercent]) => ({ transitionPercent }))
    )
    .subscribe(({ transitionPercent }) => {
      drawEntireSceneToVisible({
        bufferCtx,
        bufferCanvas,
        visibleCanvas,
        visibleCtx,
        transitionPercent,
      });
    });
};
