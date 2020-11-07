import { GameState } from "../game_state";
import { GameObject } from "../game_object";
import { CoordinateBounds } from "../coordinate";
import { Layer } from "../types";
import {
  CoordinateMap,
  getAtPath,
  removeAtPath,
  setAtPath,
} from "../coordinate_map";

const addGameObjectToLayerMap = (
  layerMap: CoordinateMap<GameObject>,
  gameObject: GameObject
) => {
  const xRow = layerMap[gameObject.x] || {};
  xRow[gameObject.y] = gameObject;
  layerMap[gameObject.x] = xRow;
};

const addGameObjectToGameState = (
  gameState: GameState,
  gameObject: GameObject
) => {
  if (gameObject.layer == Layer.GROUND) {
    addGameObjectToLayerMap(gameState.layerMaps.groundMap, gameObject);
  }
  if (gameObject.layer == Layer.OVERHEAD) {
    addGameObjectToLayerMap(gameState.layerMaps.overheadMap, gameObject);
  }
  if (gameObject.layer == Layer.PASSIVE) {
    addGameObjectToLayerMap(gameState.layerMaps.passiveMap, gameObject);
  }
  if (gameObject.layer == Layer.INTERACTIVE) {
    addGameObjectToLayerMap(gameState.layerMaps.interactiveMap, gameObject);
  }
};

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
    addGameObjectToGameState(gameState, placeable);
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
  addGameObjectToGameState(gameState, gameObject);

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

export const updateInLayerMaps = (
  params: {
    x: number;
    y: number;
    layer: Layer;
    gameState: GameState;
  },
  attrs: {
    groupId: string;
  }
) => {
  const { layer, gameState, x, y } = params;

  let map: CoordinateMap<GameObject> | null = null;

  if (layer == Layer.GROUND) {
    map = gameState.layerMaps.groundMap;
  }
  if (layer == Layer.OVERHEAD) {
    map = gameState.layerMaps.overheadMap;
  }
  if (layer == Layer.PASSIVE) {
    map = gameState.layerMaps.passiveMap;
  }
  if (layer == Layer.INTERACTIVE) {
    map = gameState.layerMaps.interactiveMap;
  }

  if (!map) {
    return;
  }

  const retrieved = getAtPath(map, x, y);

  if (!retrieved) {
    return;
  }

  retrieved.groupId = attrs.groupId;

  setAtPath(map, x, y, retrieved);

  return gameState;
};
