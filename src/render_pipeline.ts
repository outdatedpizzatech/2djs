import { isTree } from "./models/tree";
import {
  addToCoordinateMap,
  CoordinateMap,
  getFromCoordinateMap,
} from "./coordinate_map";
import { Positionable } from "./types";
import { renderPlayer } from "./renderers/player_renderer";
import { renderTree } from "./renderers/tree_renderer";
import { isWall } from "./models/wall";
import { renderWall } from "./renderers/wall_renderer";
import { GameState } from "./game_state";

// renderWithPatterning
// Determines the number of squares that could be covered by a single canvas pattern.
// For example, if we have two of the same object next to eachother, this could be accommodated with a repeating pattern
// and so this algorithm finds the maximum number of X (to the right) neighbors that could be replaced with a pattern.
// This could be enhanced to find entire rectangles of patterning, but we'll save that for when we could really use it.

function renderWithPatterning(
  renderable: Positionable,
  coordinateMap: CoordinateMap<Positionable>,
  doNotRenderMap: CoordinateMap<boolean>,
  renderedMap: CoordinateMap<boolean>,
  renderFn: (count: number) => void,
  matcherFn: (unknownObject: any) => boolean
): [CoordinateMap<boolean>, CoordinateMap<boolean>] {
  const { x, y } = renderable;

  if (!getFromCoordinateMap(x, y, doNotRenderMap)) {
    let neighborCount = 0;
    let canContinue = true;

    while (canContinue) {
      const neighborXIndex = x + 1 + neighborCount;
      const neighbor = getFromCoordinateMap(neighborXIndex, y, coordinateMap);
      if (
        neighbor &&
        matcherFn(neighbor) &&
        !getFromCoordinateMap(neighborXIndex, y, renderedMap)
      ) {
        neighborCount++;
        doNotRenderMap = addToCoordinateMap(
          neighborXIndex,
          y,
          doNotRenderMap,
          true
        );
      } else {
        canContinue = false;
      }
    }

    renderFn(neighborCount + 1);
    renderedMap = addToCoordinateMap(x, y, renderedMap, true);
  }

  return [doNotRenderMap, renderedMap];
}

function renderWithoutPatterning(
  renderable: Positionable,
  coordinateMap: CoordinateMap<Positionable>,
  doNotRenderMap: CoordinateMap<boolean>,
  renderedMap: CoordinateMap<boolean>,
  renderFn: () => void
): [CoordinateMap<boolean>, CoordinateMap<boolean>] {
  const { x, y } = renderable;

  if (!getFromCoordinateMap(x, y, doNotRenderMap)) {
    renderFn();
    renderedMap = addToCoordinateMap(x, y, renderedMap, true);
  }

  return [doNotRenderMap, renderedMap];
}

export const renderFieldRenderables = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState
) => {
  const {
    player,
    otherPlayer,
    camera,
    fieldRenderables,
    coordinateMap,
  } = gameState;

  renderPlayer(player, camera, bufferCtx);

  if (camera.withinLens(otherPlayer)) {
    renderPlayer(otherPlayer, camera, bufferCtx);
  }

  let renderedMap = {} as CoordinateMap<boolean>;
  let doNotRenderMap = {} as CoordinateMap<boolean>;

  for (let i = 0; i < fieldRenderables.length; i++) {
    const renderable = fieldRenderables[i];

    if (camera.withinLens(renderable)) {
      if (isTree(renderable)) {
        [doNotRenderMap, renderedMap] = renderWithPatterning(
          renderable,
          coordinateMap,
          doNotRenderMap,
          renderedMap,
          (count: number) => {
            renderTree(renderable, camera, bufferCtx, count);
          },
          isTree
        );
      }
      if (isWall(renderable)) {
        renderWithoutPatterning(
          renderable,
          coordinateMap,
          doNotRenderMap,
          renderedMap,
          () => {
            renderWall(renderable, camera, bufferCtx);
          }
        );
      }
    }
  }
};
