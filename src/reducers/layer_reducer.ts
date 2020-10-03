import { GameState } from "../game_state";
import { CoordinateBounds, GameObject, Layer, Placeable } from "../types";
import { cloneDeep } from "lodash";

export const updateLayerMaps = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
): [GameObject[], GameState, CoordinateBounds] => {
  const newGameState = cloneDeep(gameState);

  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      delete (newGameState.layerMaps.passiveMap[x] || {})[y];
      delete (newGameState.layerMaps.overheadMap[x] || {})[y];
      delete (newGameState.layerMaps.groundMap[x] || {})[y];
      delete (newGameState.layerMaps.interactableMap[x] || {})[y];
    }
  }

  gameObjects.forEach((placeable) => {
    if (placeable.layer == Layer.GROUND) {
      const xRow = newGameState.layerMaps.groundMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      newGameState.layerMaps.groundMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.OVERHEAD) {
      const xRow = newGameState.layerMaps.overheadMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      newGameState.layerMaps.overheadMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.PASSIVE) {
      const xRow = newGameState.layerMaps.passiveMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      newGameState.layerMaps.passiveMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.INTERACTIVE) {
      const xRow = newGameState.layerMaps.interactableMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      newGameState.layerMaps.interactableMap[placeable.x] = xRow;
    }
  });

  return [gameObjects, newGameState, coordinateBounds];
};
