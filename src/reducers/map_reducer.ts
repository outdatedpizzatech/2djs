import { cloneDeep, flow } from "lodash";
import { updateFieldRenderables } from "./field_renderables_reducer";
import { updatePlayers } from "./player_reducer";
import { updateLayerMaps } from "./layer_reducer";
import { GameObject } from "../game_object";
import { GameState } from "../game_state";
import { CoordinateBounds } from "../coordinate";

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
