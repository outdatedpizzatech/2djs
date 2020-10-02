import { GameState } from "../game_state";

export const updateCameraPosition = (gameState: GameState): GameState => {
  if (!gameState.myPlayer) {
    return gameState;
  }

  const { worldX, worldY } = gameState.myPlayer;

  gameState.camera.worldX = worldX;
  gameState.camera.worldY = worldY;

  return gameState;
};
