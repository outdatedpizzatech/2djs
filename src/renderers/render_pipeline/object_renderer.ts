import { GameState } from "../../game_state";
import { CoordinateMap } from "../../coordinate_map";
import { Layer } from "../../types";
import { pipelineRender } from "./pipeline";

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

  renderables
    .filter((renderable) => renderable.layer == Layer.GROUND)
    .forEach((renderable) => {
      [doNotRenderMap, renderedMap] = pipelineRender(
        renderable,
        camera,
        collisionMap,
        doNotRenderMap,
        renderedMap,
        bufferCtx
      );
    });

  renderables
    .filter((renderable) => renderable.layer == Layer.INTERACTION)
    .forEach((renderable) => {
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
