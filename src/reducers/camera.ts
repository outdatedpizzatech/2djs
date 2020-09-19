import { GameState } from "../game_state";

export const updateCameraPosition = (gameState: GameState): GameState => {
  gameState.camera.worldX = gameState.player.worldX;
  gameState.camera.worldY = gameState.player.worldY;

  return gameState;
};
