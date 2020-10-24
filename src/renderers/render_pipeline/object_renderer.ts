import { GameState } from "../../game_state";
import { CoordinateMap, getAtPath, setAtPath } from "../../coordinate_map";
import { matchesObject, pipelineRender } from "./pipeline";
import { isPlayer, Player } from "../../models/player";
import { Coordinate, getLoadBoundsForCoordinate } from "../../coordinate";
import { GameObject } from "../../game_object";
import { Layer } from "../../types";

export const renderAllObjects = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState,
  coordinate: Coordinate
) => {
  const { layerMaps, players } = gameState;
  const {
    debug: { layerVisibility },
  } = gameState;
  const coordinateBounds = getLoadBoundsForCoordinate(coordinate);

  const playersArray = Object.values(gameState.players) as Player[];

  const { interactiveMap, groundMap, passiveMap, overheadMap } = layerMaps;

  const idsOverlappingPlayer: { [key: string]: boolean } = {};

  const myPlayer = players[gameState.myClientId];

  if (myPlayer) {
    for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
      if (!overheadMap[x]) continue;

      for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
        const renderable = getAtPath(overheadMap, x, y);

        if (
          renderable &&
          renderable.groupId &&
          renderable.x === myPlayer.x &&
          renderable.y === myPlayer.y
        ) {
          idsOverlappingPlayer[renderable.groupId] = true;
        }
      }
    }
  }

  const renderForLayer = (layer: CoordinateMap<GameObject>) => {
    for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
      if (!layer[x]) continue;

      for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
        const renderable = getAtPath(layer, x, y);

        if (renderable) {
          for (let xa = x + 1; xa <= coordinateBounds.max.x; xa++) {
            const futureRenderable = getAtPath(layer, xa, y);
            if (!matchesObject(renderable, futureRenderable)) {
              break;
            }
          }

          if (!isPlayer(renderable)) {
            if (
              !renderable.groupId ||
              !idsOverlappingPlayer[renderable.groupId]
            ) {
              pipelineRender(renderable, bufferCtx, gameState);
            }
          }
        }
      }
    }
  };

  if (layerVisibility[Layer.GROUND]) {
    renderForLayer(groundMap);
  }

  if (layerVisibility[Layer.PASSIVE]) {
    renderForLayer(passiveMap);
  }

  if (layerVisibility[Layer.INTERACTIVE]) {
    renderForLayer(interactiveMap);
  }

  if (layerVisibility[Layer.INTERACTIVE]) {
    playersArray.forEach((player) => {
      pipelineRender(player, bufferCtx, gameState);
    });
  }

  if (layerVisibility[Layer.OVERHEAD]) {
    renderForLayer(overheadMap);
  }
};
