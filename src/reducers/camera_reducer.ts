import { GameState } from "../game_state";

export const updateCameraPosition = (gameState: GameState): GameState => {
  const { worldX, worldY } = gameState.player;

  gameState.camera.worldX = worldX;
  gameState.camera.worldY = worldY;

  return gameState;
};
