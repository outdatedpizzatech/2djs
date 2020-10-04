import { GameState } from "../game_state";
import { GRID_INTERVAL } from "../common";
import { Direction, getModsFromDirection } from "../direction";
import { isPlayer, Player, playerFactory } from "../models/player";
import { cloneDeep } from "lodash";
import { CoordinateBounds, GameObject } from "../types";

export const addPlayer = (
  gameState: GameState,
  x: number,
  y: number
): GameState => {
  const newGameState = cloneDeep(gameState);

  const newPlayer = playerFactory({ x, y });

  if (!newGameState.myPlayer) {
    newGameState.myPlayer = newPlayer;
  }

  newGameState.players.push(newPlayer);

  return newGameState;
};

export const updatePlayerMovementDirection = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  if (gameState.myPlayer) {
    gameState.myPlayer.movementDirection = direction;
  }

  return [direction, gameState];
};

export const updatePlayerFacingDirection = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  if (gameState.myPlayer) {
    gameState.myPlayer.facingDirection = direction;
  }

  return [direction, gameState];
};

export const updatePlayerCoordinates = (
  direction: Direction,
  gameState: GameState
): [Direction, GameState] => {
  if (gameState.myPlayer) {
    const [xMod, yMod] = getModsFromDirection(direction);

    gameState.myPlayer.x += xMod;
    gameState.myPlayer.y += yMod;
  }

  return [direction, gameState];
};

export const updatePlayerMovement = (
  deltaTime: number,
  gameState: GameState
): GameState => {
  if (!gameState.myPlayer) {
    return gameState;
  }
  const { movementDirection, movementSpeed } = gameState.myPlayer;

  const [xMod, yMod] = getModsFromDirection(movementDirection);

  const destinationX = gameState.myPlayer.x * GRID_INTERVAL;
  const destinationY = gameState.myPlayer.y * GRID_INTERVAL;

  gameState.myPlayer.worldX += xMod * movementSpeed * deltaTime;
  gameState.myPlayer.worldY += yMod * movementSpeed * deltaTime;
  gameState.myPlayer.moving = true;

  let haltMovement = false;

  const { worldX, worldY } = gameState.myPlayer;

  if (movementDirection == Direction.UP) {
    haltMovement = worldY < destinationY;
    if (haltMovement) gameState.myPlayer.worldY = destinationY;
  } else if (movementDirection == Direction.DOWN) {
    haltMovement = worldY > destinationY;
    if (haltMovement) gameState.myPlayer.worldY = destinationY;
  } else if (movementDirection == Direction.LEFT) {
    haltMovement = worldX < destinationX;
    if (haltMovement) gameState.myPlayer.worldX = destinationX;
  } else if (movementDirection == Direction.RIGHT) {
    haltMovement = worldX > destinationX;
    if (haltMovement) gameState.myPlayer.worldX = destinationX;
  }

  if (haltMovement) {
    gameState.myPlayer.moving = false;
    gameState.myPlayer.movementDirection = Direction.NONE;
  }

  return gameState;
};

export const updatePlayers = (
  gameObjects: GameObject[],
  gameState: GameState,
  coordinateBounds: CoordinateBounds
): [GameObject[], GameState, CoordinateBounds] => {
  const newGameState = cloneDeep(gameState);

  const nonExistingPlayers = gameObjects.filter((gameObject) => {
    return (
      isPlayer(gameObject) &&
      !newGameState.players.find(
        (player) => gameObject.clientId == player.clientId
      )
    );
  }) as Player[];

  debugger;

  const updatedPlayers = newGameState.players.concat(nonExistingPlayers);

  newGameState.players = updatedPlayers;

  return [gameObjects, newGameState, coordinateBounds];
};
