import { GameState } from "../game_state";
import { CoordinateBounds, GameObject } from "../types";

export const updateFieldRenderables = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
): [GameObject[], GameState, CoordinateBounds] => {
  const updatedFieldRenderables = gameState.fieldRenderables
    .filter((fieldRenderable) => {
      return (
        fieldRenderable.x >= coordinateBounds.min.x &&
        fieldRenderable.x <= coordinateBounds.max.x &&
        fieldRenderable.y >= coordinateBounds.min.y &&
        fieldRenderable.y <= coordinateBounds.max.y
      );
    })
    .concat(gameObjects);

  gameState.fieldRenderables = updatedFieldRenderables;

  return [gameObjects, gameState, coordinateBounds];
};
