import { GameState } from "../../game_state";
import { CoordinateMap, getAtPath } from "../../coordinate_map";
import { pipelineRender } from "./pipeline";
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

  const renderColumnForLayer = (
    layer: CoordinateMap<GameObject>,
    y: number
  ) => {
    for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
      const renderable = getAtPath(layer, x, y);

      if (renderable) {
        if (!isPlayer(renderable)) {
          if (
            !renderable.groupId ||
            !idsOverlappingPlayer[renderable.groupId]
          ) {
            pipelineRender(renderable, bufferCtx, gameState, y);
          }
        }
      }
    }
  };

  for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
    if (layerVisibility[Layer.GROUND]) {
      renderColumnForLayer(groundMap, y);
    }
    if (layerVisibility[Layer.PASSIVE]) {
      renderColumnForLayer(passiveMap, y);
    }
    if (layerVisibility[Layer.INTERACTIVE]) {
      renderColumnForLayer(interactiveMap, y);
    }

    playersArray.forEach((player) => {
      pipelineRender(player, bufferCtx, gameState, y);
    });

    if (layerVisibility[Layer.OVERHEAD]) {
      renderColumnForLayer(overheadMap, y);
    }
  }
};
