import { GameState } from "../game_state";
import { GRID_INTERVAL } from "../common";
import { Direction, getModsFromDirection } from "../direction";
import { isPlayer, Player, playerFactory } from "../models/player";
import { GameObject } from "../game_object";
import { cloneDeep } from "../clone_deep";

export const addPlayer = (
  gameState: GameState,
  player: Partial<Player> & { _id: string }
): GameState => {
  const newPlayer = playerFactory(player);

  if (!gameState.myClientId) {
    gameState.myClientId = newPlayer.clientId;
  }

  gameState.players[newPlayer.clientId] = newPlayer;

  return gameState;
};

export const removePlayer = (
  gameState: GameState,
  clientId: string
): GameState => {
  delete gameState.players[clientId];

  return gameState;
};

export const updatePlayerMovementDirection = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, direction, player } = params;

  const playerToUpdate = gameState.players[player.clientId];

  if (playerToUpdate) {
    playerToUpdate.movementQueue.push(direction);
    gameState.players[player.clientId] = playerToUpdate;
  }

  return gameState;
};

export const updatePlayerFacingDirection = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, direction, player } = params;

  const newGameState = cloneDeep(gameState);

  const playerToUpdate = newGameState.players[player.clientId];

  if (playerToUpdate) {
    playerToUpdate.facingDirection = direction;
    newGameState.players[player.clientId] = playerToUpdate;
  }

  return newGameState;
};

export const updatePlayerCoordinates = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, direction, player } = params;

  const [xMod, yMod] = getModsFromDirection(direction);

  const playerToUpdate = gameState.players[player.clientId];

  if (playerToUpdate) {
    playerToUpdate.x += xMod;
    playerToUpdate.y += yMod;

    gameState.players[player.clientId] = playerToUpdate;
  }

  return gameState;
};

export const updatePlayerMovement = (
  deltaTime: number,
  gameState: GameState,
  player: Player
): GameState => {
  const playerToUpdate = gameState.players[player.clientId];

  if (!playerToUpdate) {
    return gameState;
  }

  const { movementQueue, movementSpeed } = playerToUpdate;

  const movementDirection = movementQueue[0];

  const [xMod, yMod] = getModsFromDirection(movementDirection);

  const destinationX = playerToUpdate.x * GRID_INTERVAL;
  const destinationY = playerToUpdate.y * GRID_INTERVAL;

  playerToUpdate.worldX += xMod * movementSpeed * deltaTime;
  playerToUpdate.worldY += yMod * movementSpeed * deltaTime;
  playerToUpdate.moving = true;

  let haltMovement = false;

  const { worldX, worldY } = playerToUpdate;

  if (movementDirection == Direction.UP) {
    haltMovement = worldY < destinationY;
    if (haltMovement) playerToUpdate.worldY = destinationY;
  } else if (movementDirection == Direction.DOWN) {
    haltMovement = worldY > destinationY;
    if (haltMovement) playerToUpdate.worldY = destinationY;
  } else if (movementDirection == Direction.LEFT) {
    haltMovement = worldX < destinationX;
    if (haltMovement) playerToUpdate.worldX = destinationX;
  } else if (movementDirection == Direction.RIGHT) {
    haltMovement = worldX > destinationX;
    if (haltMovement) playerToUpdate.worldX = destinationX;
  }

  if (haltMovement) {
    playerToUpdate.moving = false;
    playerToUpdate.movementQueue = playerToUpdate.movementQueue.slice(1);
  }

  gameState.players[player.clientId] = playerToUpdate;

  return gameState;
};

export const updatePlayers = (
  gameObjects: GameObject[],
  gameState: GameState
) => {
  const newGameState = cloneDeep(gameState);

  const players = gameObjects.filter((gameObject) => {
    return isPlayer(gameObject);
  }) as Player[];

  players
    .filter((player) => player.clientId !== gameState.myClientId)
    .forEach((player) => {
      newGameState.players[player.clientId] = player;
    });

  return newGameState;
};
