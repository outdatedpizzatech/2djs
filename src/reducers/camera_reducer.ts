import { GameState } from "../game_state";
import { cloneDeep } from "lodash";

export const updateCameraPosition = (gameState: GameState): GameState => {
  const newGameState = cloneDeep(gameState);

  if (!newGameState.myPlayer) {
    return newGameState;
  }

  const { worldX, worldY } = newGameState.myPlayer;

  newGameState.camera.worldX = worldX;
  newGameState.camera.worldY = worldY;

  return newGameState;
};
