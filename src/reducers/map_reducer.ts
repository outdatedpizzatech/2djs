import { flow } from "lodash";
import {
  addToFieldRenderables,
  clearFieldRenderables,
  updateFieldRenderables,
} from "./field_renderables_reducer";
import { updatePlayers } from "./player_reducer";
import {
  addToLayerMaps,
  clearLayerMaps,
  updateLayerMaps,
} from "./layer_reducer";
import { GameObject } from "../game_object";
import { GameState } from "../game_state";
import { CoordinateBounds } from "../coordinate";
import { cloneDeep } from "../clone_deep";

export const updateMapWithObjects = (params: {
  gameState: GameState;
  gameObjects: GameObject[];
  coordinateBounds: CoordinateBounds;
}) => {
  const { gameState, gameObjects, coordinateBounds } = params;

  return flow(
    () => cloneDeep(gameState),
    (newGameState) =>
      updateFieldRenderables(gameObjects, newGameState, coordinateBounds),
    (newGameState) => updatePlayers(gameObjects, newGameState),
    (newGameState) =>
      updateLayerMaps(gameObjects, newGameState, coordinateBounds)
  )();
};

export const clearMapOfObjects = (gameState: GameState) => {
  return flow(
    () => cloneDeep(gameState),
    (newGameState) => clearFieldRenderables(newGameState),
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
    (newGameState) => addToFieldRenderables(gameObject, newGameState),
    (newGameState) => addToLayerMaps(gameObject, newGameState)
  )();
};
