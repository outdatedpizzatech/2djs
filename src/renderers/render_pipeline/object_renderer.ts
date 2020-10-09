import { GameState } from "../../game_state";
import { CoordinateMap, getAtPath, setAtPath } from "../../coordinate_map";
import { matchesObject, pipelineRender } from "./pipeline";
import { isPlayer, Player } from "../../models/player";
import { Coordinate, getLoadBoundsForCoordinate } from "../../coordinate";
import { GameObject } from "../../game_object";

export const renderAllObjects = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState,
  coordinate: Coordinate
) => {
  const { layerMaps, players } = gameState;
  const coordinateBounds = getLoadBoundsForCoordinate(coordinate);

  const playersArray = Object.values(gameState.players) as Player[];

  const { interactableMap, groundMap, passiveMap, overheadMap } = layerMaps;

  const idsOverlappingPlayer: { [key: number]: boolean } = {};

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
    const renderedMap: any = {};

    for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
      if (!layer[x]) continue;

      for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
        if (getAtPath(renderedMap, x, y)) {
          continue;
        }

        const renderable = getAtPath(layer, x, y);

        if (renderable) {
          let renderCount = 1;

          for (let xa = x + 1; xa <= coordinateBounds.max.x; xa++) {
            const futureRenderable = getAtPath(layer, xa, y);
            if (!matchesObject(renderable, futureRenderable)) {
              break;
            }

            setAtPath(renderedMap, xa, y, true);
            renderCount++;
          }

          if (!isPlayer(renderable)) {
            if (
              !renderable.groupId ||
              !idsOverlappingPlayer[renderable.groupId]
            ) {
              pipelineRender(renderable, bufferCtx, renderCount, gameState);
            }
          }
        }
      }
    }
  };

  renderForLayer(groundMap);
  renderForLayer(passiveMap);
  renderForLayer(interactableMap);

  playersArray.forEach((player) => {
    pipelineRender(player, bufferCtx, 1, gameState);
  });

  renderForLayer(overheadMap);
};
