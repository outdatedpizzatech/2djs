// renderWithPatterning
// Determines the number of squares that could be covered by a single canvas pattern.
// For example, if we have two of the same object next to eachother, this could be accommodated with a repeating pattern
// and so this algorithm finds the maximum number of X (to the right) neighbors that could be replaced with a pattern.
// This could be enhanced to find entire rectangles of patterning, but we'll save that for when we could really use it.

import { Layer } from "../../types";
import {
  addToCoordinateMap,
  CoordinateMap,
  getFromCoordinateMap,
  LayerMaps,
  LayerMark,
  LayerMarkKey,
} from "../../coordinate_map";
import { Placeable } from "../../game_object";

const getLayerMap = (layer: Layer, layerMaps: LayerMaps) => {
  const layerMap = {
    [Layer.GROUND]: layerMaps.groundMap,
    [Layer.INTERACTIVE]: layerMaps.interactableMap,
    [Layer.PASSIVE]: layerMaps.passiveMap,
    [Layer.OVERHEAD]: layerMaps.overheadMap,
  };

  return layerMap[layer];
};

const getLayerMarkKey = (layer: Layer): LayerMarkKey => {
  const layerMarks = {
    [Layer.GROUND]: "ground",
    [Layer.INTERACTIVE]: "interaction",
    [Layer.PASSIVE]: "passive",
    [Layer.OVERHEAD]: "overhead",
  };

  return layerMarks[layer] as LayerMarkKey;
};

const getLayerMark = (
  x: number,
  y: number,
  coordinateMap: CoordinateMap<LayerMark>
) => {
  return getFromCoordinateMap(x, y, coordinateMap) || ({} as LayerMark);
};

export function renderWithPatterning(
  renderable: Placeable,
  layerMaps: LayerMaps,
  doNotRenderMap: CoordinateMap<LayerMark>,
  renderedMap: CoordinateMap<LayerMark>,
  renderFn: (count: number) => void,
  matcherFn: (unknownObject: any) => boolean
): [CoordinateMap<LayerMark>, CoordinateMap<LayerMark>] {
  const { x, y, layer } = renderable;

  const layerMap = getLayerMap(layer, layerMaps);
  const layerMarkKey = getLayerMarkKey(layer);

  if (!getLayerMark(x, y, doNotRenderMap)[layerMarkKey]) {
    let neighborCount = 0;
    let canContinue = true;

    while (canContinue) {
      const neighborXIndex = x + 1 + neighborCount;
      const neighbor = getFromCoordinateMap(neighborXIndex, y, layerMap);
      if (
        neighbor &&
        matcherFn(neighbor) &&
        !getLayerMark(neighborXIndex, y, renderedMap)[layerMarkKey]
      ) {
        neighborCount++;
        const currentEntry = getLayerMark(neighborXIndex, y, doNotRenderMap);
        currentEntry[layerMarkKey] = true;
        doNotRenderMap = addToCoordinateMap(
          neighborXIndex,
          y,
          doNotRenderMap,
          currentEntry
        );
      } else {
        canContinue = false;
      }
    }

    renderFn(neighborCount + 1);
    const currentEntry = getLayerMark(x, y, renderedMap);
    currentEntry[layerMarkKey] = true;
    renderedMap = addToCoordinateMap(x, y, renderedMap, currentEntry);
  }

  return [doNotRenderMap, renderedMap];
}

export function renderWithoutPatterning(
  renderable: Placeable,
  layerMaps: LayerMaps,
  doNotRenderMap: CoordinateMap<LayerMark>,
  renderedMap: CoordinateMap<LayerMark>,
  renderFn: () => void
): [CoordinateMap<LayerMark>, CoordinateMap<LayerMark>] {
  const { x, y, layer } = renderable;

  const layerMarkKey = getLayerMarkKey(layer);
  const onDoNotRenderList = getLayerMark(x, y, doNotRenderMap)[layerMarkKey];

  if (!onDoNotRenderList) {
    renderFn();
    const currentEntry = getLayerMark(x, y, renderedMap);
    currentEntry[layerMarkKey] = true;
    renderedMap = addToCoordinateMap(x, y, renderedMap, currentEntry);
  }

  return [doNotRenderMap, renderedMap];
}
