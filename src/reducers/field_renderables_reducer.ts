import { GameState } from "../game_state";
import { isPlayer } from "../models/player";
import { GameObject } from "../game_object";
import { CoordinateBounds } from "../coordinate";

export const updateFieldRenderables = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
) => {
  const updatedFieldRenderables = gameState.fieldRenderables
    .filter((fieldRenderable) => {
      return !(
        fieldRenderable.x >= coordinateBounds.min.x &&
        fieldRenderable.x <= coordinateBounds.max.x &&
        fieldRenderable.y >= coordinateBounds.min.y &&
        fieldRenderable.y <= coordinateBounds.max.y
      );
    })
    .concat(gameObjects.filter((gameObject) => !isPlayer(gameObject)));

  gameState.fieldRenderables = updatedFieldRenderables;

  return gameState;
};

export const addToFieldRenderables = (
  gameObject: GameObject,
  gameState: GameState
) => {
  gameState.fieldRenderables.push(gameObject);

  return gameState;
};
