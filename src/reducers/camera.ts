import {GameState} from "../game_state";

export const updateCameraPosition = (gameState: GameState): GameState => {
  gameState.camera.x = gameState.player.positionX;
  gameState.camera.y = gameState.player.positionY;

  return gameState;
};
