import { GameState } from "../game_state";
import { GameObject } from "../game_object";
import { CoordinateBounds } from "../coordinate";
import { Layer } from "../types";
import { removeAtPath } from "../coordinate_map";

export const updateLayerMaps = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
) => {
  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      delete (gameState.layerMaps.passiveMap[x] || {})[y];
      delete (gameState.layerMaps.overheadMap[x] || {})[y];
      delete (gameState.layerMaps.groundMap[x] || {})[y];
      delete (gameState.layerMaps.interactiveMap[x] || {})[y];
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
      const xRow = gameState.layerMaps.interactiveMap[placeable.x] || {};
      xRow[placeable.y] = placeable;
      gameState.layerMaps.interactiveMap[placeable.x] = xRow;
    }
  });

  return gameState;
};

export const clearLayerMaps = (gameState: GameState) => {
  gameState.layerMaps.groundMap = {};
  gameState.layerMaps.overheadMap = {};
  gameState.layerMaps.passiveMap = {};
  gameState.layerMaps.interactiveMap = {};

  return gameState;
};

export const addToLayerMaps = (
  gameObject: GameObject,
  gameState: GameState
) => {
  if (gameObject.layer == Layer.GROUND) {
    const xRow = gameState.layerMaps.groundMap[gameObject.x] || {};
    xRow[gameObject.y] = gameObject;
    gameState.layerMaps.groundMap[gameObject.x] = xRow;
  }
  if (gameObject.layer == Layer.OVERHEAD) {
    const xRow = gameState.layerMaps.overheadMap[gameObject.x] || {};
    xRow[gameObject.y] = gameObject;
    gameState.layerMaps.overheadMap[gameObject.x] = xRow;
  }
  if (gameObject.layer == Layer.PASSIVE) {
    const xRow = gameState.layerMaps.passiveMap[gameObject.x] || {};
    xRow[gameObject.y] = gameObject;
    gameState.layerMaps.passiveMap[gameObject.x] = xRow;
  }
  if (gameObject.layer == Layer.INTERACTIVE) {
    const xRow = gameState.layerMaps.interactiveMap[gameObject.x] || {};
    xRow[gameObject.y] = gameObject;
    gameState.layerMaps.interactiveMap[gameObject.x] = xRow;
  }

  return gameState;
};

export const removeFromLayerMaps = (
  x: number,
  y: number,
  layer: Layer,
  gameState: GameState
) => {
  if (layer == Layer.GROUND) {
    removeAtPath(gameState.layerMaps.groundMap, x, y);
  }
  if (layer == Layer.OVERHEAD) {
    removeAtPath(gameState.layerMaps.overheadMap, x, y);
  }
  if (layer == Layer.PASSIVE) {
    removeAtPath(gameState.layerMaps.passiveMap, x, y);
  }
  if (layer == Layer.INTERACTIVE) {
    removeAtPath(gameState.layerMaps.interactiveMap, x, y);
  }

  return gameState;
};
