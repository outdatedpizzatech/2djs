import { GameState } from "../game_state";
import { GRID_INTERVAL } from "../common";
import { getAnimationFrames, nextAnimationFrame } from "../models/player";
import { Direction, getModsFromDirection } from "../direction";

export const updatePlayerDirection = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  gameState.player.facingDirection = direction;
  gameState.player.movementDirection = direction;

  return [direction, gameState];
};

export const updatePlayerCoordinates = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  const [xMod, yMod] = getModsFromDirection(direction);

  gameState.player.x += xMod;
  gameState.player.y += yMod;

  return [direction, gameState];
};

export const updatePlayerMovement = (gameState: GameState): GameState => {
  const { movementDirection, movementSpeed } = gameState.player;

  const [xMod, yMod] = getModsFromDirection(movementDirection);

  gameState.player.worldX += xMod * movementSpeed;
  gameState.player.worldY += yMod * movementSpeed;

  let haltMovement = false;

  const { worldX, worldY } = gameState.player;

  if (
    movementDirection == Direction.UP ||
    movementDirection == Direction.DOWN
  ) {
    haltMovement = worldY % GRID_INTERVAL === 0;
  } else if (
    movementDirection == Direction.RIGHT ||
    movementDirection == Direction.LEFT
  ) {
    haltMovement = worldX % GRID_INTERVAL === 0;
  }

  if (haltMovement) {
    gameState.player.movementDirection = Direction.NONE;
  }

  return gameState;
};

export const updatePlayerAnimation = (gameState: GameState): GameState => {
  const currentAnimation = getAnimationFrames(gameState.player);
  gameState.player.animationIndex = nextAnimationFrame(
    currentAnimation,
    gameState.player.animationIndex
  );

  return gameState;
};
