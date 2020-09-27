import { GameState } from "../../game_state";
import { CoordinateMap } from "../../coordinate_map";
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
    collisionMap,
  } = gameState;

  let doNotRenderMap = {} as CoordinateMap<boolean>;
  let renderedMap = {} as CoordinateMap<boolean>;
  const renderables = fieldRenderables.concat([player, otherPlayer]);

  const [groundRenderables, interactionRenderables] = partition(
    renderables,
    (renderable) => renderable.layer == Layer.GROUND
  );

  groundRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      camera,
      collisionMap,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });

  interactionRenderables.forEach((renderable) => {
    [doNotRenderMap, renderedMap] = pipelineRender(
      renderable,
      camera,
      collisionMap,
      doNotRenderMap,
      renderedMap,
      bufferCtx
    );
  });
};
