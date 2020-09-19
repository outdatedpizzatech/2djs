import { GameState } from "../game_state";
import { Direction, GRID_INTERVAL } from "../common";
import { decideCurrentAnimation, nextAnimationFrame } from "../player";

export const updatePlayerDirection = (
  direction: Direction,
  gameState: GameState
): GameState => {
  gameState.player.facingDirection = direction;
  gameState.player.movementDirection = direction;

  return gameState;
};

export const updatePlayerMovement = (gameState: GameState): GameState => {
  if (gameState.player.movementDirection == Direction.UP) {
    gameState.player.worldY -= gameState.player.movementSpeed;

    if (gameState.player.worldY % GRID_INTERVAL === 0) {
      gameState.player.movementDirection = Direction.NONE;
    }
  }

  if (gameState.player.movementDirection == Direction.RIGHT) {
    gameState.player.worldX += gameState.player.movementSpeed;

    if (gameState.player.worldX % GRID_INTERVAL === 0) {
      gameState.player.movementDirection = Direction.NONE;
    }
  }

  if (gameState.player.movementDirection == Direction.DOWN) {
    gameState.player.worldY += gameState.player.movementSpeed;

    if (gameState.player.worldY % GRID_INTERVAL === 0) {
      gameState.player.movementDirection = Direction.NONE;
    }
  }

  if (gameState.player.movementDirection == Direction.LEFT) {
    gameState.player.worldX -= gameState.player.movementSpeed;

    if (gameState.player.worldX % GRID_INTERVAL === 0) {
      gameState.player.movementDirection = Direction.NONE;
    }
  }

  return gameState;
};

export const updatePlayerAnimation = (gameState: GameState): GameState => {
  const currentAnimation = decideCurrentAnimation(gameState.player);
  gameState.player.animationIndex = nextAnimationFrame(
    currentAnimation,
    gameState.player.animationIndex
  );

  return gameState;
};
