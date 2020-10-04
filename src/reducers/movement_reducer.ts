import { cloneDeep, flow } from "lodash";
import { GameState, updateCoordinateMap } from "../game_state";
import {
  updatePlayerCoordinates,
  updatePlayerFacingDirection,
  updatePlayerMovementDirection,
} from "./player_reducer";
import { Player } from "../models/player";
import { Direction } from "../direction";

export const updateMovementForPlayer = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { direction, gameState, player } = params;

  if (!player) {
    return;
  }

  return flow(
    () => cloneDeep(gameState),
    (newGameState) =>
      updateCoordinateMap({
        direction,
        gameState: newGameState,
        player,
      }),
    (newGameState) =>
      updatePlayerCoordinates({
        direction,
        gameState: newGameState,
        player,
      }),
    (newGameState) =>
      updatePlayerMovementDirection({
        direction,
        gameState: newGameState,
        player,
      })
  )();
};

export const updateFacingDirectionForPlayer = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, direction, player } = params;

  return flow(
    () => cloneDeep(gameState),
    (newGameState) =>
      updatePlayerFacingDirection({
        direction,
        gameState: newGameState,
        player,
      })
  )();
};
