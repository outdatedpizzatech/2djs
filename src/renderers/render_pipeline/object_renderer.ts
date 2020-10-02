import { GameState } from "../../game_state";
import { CoordinateMap, LayerMark } from "../../coordinate_map";
import { GameObject, Layer } from "../../types";
import { pipelineRender } from "./pipeline";

export const renderAllObjects = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState
) => {
  const { myPlayer, camera, fieldRenderables, layerMaps, players } = gameState;

  let doNotRenderMap = {} as CoordinateMap<LayerMark>;
  let renderedMap = {} as CoordinateMap<LayerMark>;
  const renderables = fieldRenderables.concat(players);

  const groundRenderables = new Array<GameObject>();
  const passiveRenderables = new Array<GameObject>();
  const interactiveRenderables = new Array<GameObject>();
  const overheadRenderables = new Array<GameObject>();

  renderables.forEach((renderable) => {
    if (renderable.layer == Layer.GROUND) {
      groundRenderables.push(renderable);
    }
    if (renderable.layer == Layer.PASSIVE) {
      passiveRenderables.push(renderable);
    }
    if (renderable.layer == Layer.INTERACTIVE) {
      interactiveRenderables.push(renderable);
    }
    if (renderable.layer == Layer.OVERHEAD) {
      overheadRenderables.push(renderable);
    }
  });

  groundRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      players,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  passiveRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      players,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  interactiveRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      players,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  const idsOverlappingPlayer: { [key: number]: boolean } = {};

  if (myPlayer) {
    overheadRenderables.forEach((renderable) => {
      if (
        renderable.groupId &&
        renderable.x === myPlayer.x &&
        renderable.y === myPlayer.y
      ) {
        idsOverlappingPlayer[renderable.groupId] = true;
      }
    });
  }

  overheadRenderables.forEach((renderable) => {
    if (!renderable.groupId || !idsOverlappingPlayer[renderable.groupId]) {
      [doNotRenderMap, renderedMap] = pipelineRender(
        renderable,
        players,
        camera,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        bufferCtx
      );
    }
  });
};
