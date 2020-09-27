import { GameState } from "../../game_state";
import { CoordinateMap, LayerMark } from "../../coordinate_map";
import { Layer } from "../../types";
import { pipelineRender } from "./pipeline";
import { partition } from "underscore";

export const renderAllObjects = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState
) => {
  const {
    player,
    otherPlayer,
    camera,
    fieldRenderables,
    layerMaps,
  } = gameState;

  let doNotRenderMap = {} as CoordinateMap<LayerMark>;
  let renderedMap = {} as CoordinateMap<LayerMark>;
  const renderables = fieldRenderables.concat([player, otherPlayer]);

  const [groundRenderables, nonGroundRenderables] = partition(
    renderables,
    (renderable) => renderable.layer == Layer.GROUND
  );

  const [interactionRenderables, overheadRenderables] = partition(
    nonGroundRenderables,
    (renderable) => renderable.layer == Layer.INTERACTION
  );

  groundRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  interactionRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  overheadRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      camera,
      layerMaps,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });
};
