import { flow } from "lodash";
import {
  updatePlayerCoordinates,
  updatePlayerFacingDirection,
  updatePlayerMovementDirection,
} from "./player_reducer";
import { Player } from "../models/player";
import { Direction, getModsFromDirection } from "../direction";
import { cloneDeep } from "../clone_deep";
import { removeAtPath, setAtPath } from "../coordinate_map";
import { GameState } from "../game_state";

export const updateMovementForPlayer = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { direction, gameState, player } = params;

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

export const updateCoordinateMap = (params: {
  direction: Direction;
  gameState: GameState;
  player: Player;
}) => {
  const { gameState, player, direction } = params;
  const {
    layerMaps: { interactiveMap },
  } = gameState;

  const { x, y } = player;

  const [xMod, yMod] = getModsFromDirection(direction);

  setAtPath(gameState.layerMaps.interactiveMap, x + xMod, y + yMod, player);
  removeAtPath(interactiveMap, x, y);

  return gameState;
};
