import { GameState } from "../game_state";
import { CoordinateBounds, GameObject } from "../types";
import { cloneDeep } from "lodash";
import { isPlayer, Player } from "../models/player";

export const updateFieldRenderables = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
): [GameObject[], GameState, CoordinateBounds] => {
  const newGameState = cloneDeep(gameState);

  const updatedFieldRenderables = newGameState.fieldRenderables
    .filter((fieldRenderable) => {
      return !(
        fieldRenderable.x >= coordinateBounds.min.x &&
        fieldRenderable.x <= coordinateBounds.max.x &&
        fieldRenderable.y >= coordinateBounds.min.y &&
        fieldRenderable.y <= coordinateBounds.max.y
      );
    })
    .concat(gameObjects.filter((gameObject) => !isPlayer(gameObject)));

  newGameState.fieldRenderables = updatedFieldRenderables;

  return [gameObjects, newGameState, coordinateBounds];
};
