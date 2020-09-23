import { GameState } from "../game_state";
import { GRID_INTERVAL } from "../common";
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

export const updatePlayerMovement = (
  deltaTime: number,
  gameState: GameState
): GameState => {
  const { movementDirection, movementSpeed } = gameState.player;

  const [xMod, yMod] = getModsFromDirection(movementDirection);

  const destinationX = gameState.player.x * GRID_INTERVAL;
  const destinationY = gameState.player.y * GRID_INTERVAL;

  gameState.player.worldX += xMod * movementSpeed * deltaTime;
  gameState.player.worldY += yMod * movementSpeed * deltaTime;

  let haltMovement = false;

  const { worldX, worldY } = gameState.player;

  if (movementDirection == Direction.UP) {
    haltMovement = worldY < destinationY;
    if (haltMovement) gameState.player.worldY = destinationY;
  } else if (movementDirection == Direction.DOWN) {
    haltMovement = worldY > destinationY;
    if (haltMovement) gameState.player.worldY = destinationY;
  } else if (movementDirection == Direction.LEFT) {
    haltMovement = worldX < destinationX;
    if (haltMovement) gameState.player.worldX = destinationX;
  } else if (movementDirection == Direction.RIGHT) {
    haltMovement = worldX > destinationX;
    if (haltMovement) gameState.player.worldX = destinationX;
  }

  if (haltMovement) {
    gameState.player.movementDirection = Direction.NONE;
  }

  return gameState;
};
