import { GameState } from "../game_state";

export const updateCameraPosition = (gameState: GameState): GameState => {
  const player = gameState.players[gameState.myClientId];

  if (player) {
    const { worldX, worldY } = player;

    gameState.camera.worldX = worldX;
    gameState.camera.worldY = worldY;
  }

  return gameState;
};
