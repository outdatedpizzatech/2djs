import { flow } from "lodash";
import { updatePlayers } from "./player_reducer";
import {
  addToLayerMaps,
  clearLayerMaps,
  removeFromLayerMaps,
  updateInLayerMaps,
  updateLayerMaps,
} from "./layer_reducer";
import { GameObject } from "../game_object";
import { GameState } from "../game_state";
import { CoordinateBounds } from "../coordinate";
import { cloneDeep } from "../clone_deep";
import { Layer } from "../types";

export const updateMapWithObjects = (params: {
  gameState: GameState;
  gameObjects: GameObject[];
  coordinateBounds: CoordinateBounds;
}) => {
  const { gameState, gameObjects, coordinateBounds } = params;

  return flow(
    () => cloneDeep(gameState),
    (newGameState) => updatePlayers(gameObjects, newGameState),
    (newGameState) =>
      updateLayerMaps(gameObjects, newGameState, coordinateBounds)
  )();
};

export const clearMapOfObjects = (gameState: GameState) => {
  return flow(
    () => cloneDeep(gameState),
    (newGameState) => clearLayerMaps(newGameState)
  )();
};

export const addObjectToMap = (params: {
  gameState: GameState;
  gameObject: GameObject;
}) => {
  const { gameState, gameObject } = params;

  return flow(
    () => cloneDeep(gameState),
    (newGameState) => addToLayerMaps(gameObject, newGameState)
  )();
};

export const removeObjectFromMap = (params: {
  gameState: GameState;
  layer: Layer;
  x: number;
  y: number;
}) => {
  const { gameState, x, y, layer } = params;

  return flow(
    () => cloneDeep(gameState),
    (newGameState) => removeFromLayerMaps(x, y, layer, newGameState)
  )();
};

export const updateObjectInMap = (
  params: {
    gameState: GameState;
    layer: Layer;
    x: number;
    y: number;
  },
  attrs: {
    groupId: string;
  }
) => {
  const { gameState, x, y, layer } = params;

  return flow(
    () => cloneDeep(gameState),
    (gameState) => updateInLayerMaps({ x, y, layer, gameState }, attrs)
  )();
};
