import { GameState } from "../game_state";
import { GRID_INTERVAL } from "../common";
import { Direction, getModsFromDirection } from "../direction";

export const updatePlayerMovementDirection = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  gameState.player.movementDirection = direction;

  return [direction, gameState];
};

export const updatePlayerFacingDirection = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  gameState.player.facingDirection = direction;

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
  gameState.player.moving = true;

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
    gameState.player.moving = false;
    gameState.player.movementDirection = Direction.NONE;
  }

  return gameState;
};
