// renderWithPatterning
// Determines the number of squares that could be covered by a single canvas pattern.
// For example, if we have two of the same object next to eachother, this could be accommodated with a repeating pattern
// and so this algorithm finds the maximum number of X (to the right) neighbors that could be replaced with a pattern.
// This could be enhanced to find entire rectangles of patterning, but we'll save that for when we could really use it.

import { Positionable } from "../../types";
import {
  addToCoordinateMap,
  CoordinateMap,
  getFromCoordinateMap,
} from "../../coordinate_map";

export function renderWithPatterning(
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

export function renderWithoutPatterning(
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
