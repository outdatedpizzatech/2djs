import { GameState } from "../game_state";
import { CoordinateBounds, GameObject, Layer, Placeable } from "../types";

export const updateLayerMaps = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
): [GameObject[], GameState, CoordinateBounds] => {
  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      delete (gameState.layerMaps.passiveMap[x] || {})[y];
      delete (gameState.layerMaps.overheadMap[x] || {})[y];
      delete (gameState.layerMaps.groundMap[x] || {})[y];
      delete (gameState.layerMaps.interactableMap[x] || {})[y];
    }
  }

  gameObjects.forEach((placeable) => {
    if (placeable.layer == Layer.GROUND) {
      const xRow = gameState.layerMaps.groundMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      gameState.layerMaps.groundMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.OVERHEAD) {
      const xRow = gameState.layerMaps.overheadMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      gameState.layerMaps.overheadMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.PASSIVE) {
      const xRow = gameState.layerMaps.passiveMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      gameState.layerMaps.passiveMap[placeable.x] = xRow;
    }
    if (placeable.layer == Layer.INTERACTIVE) {
      const xRow = gameState.layerMaps.interactableMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      gameState.layerMaps.interactableMap[placeable.x] = xRow;
    }
  });

  return [gameObjects, gameState, coordinateBounds];
};
