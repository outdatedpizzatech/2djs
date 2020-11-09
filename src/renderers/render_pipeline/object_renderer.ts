import { GameState } from "../../game_state";
import { CoordinateMap, getAtPath } from "../../coordinate_map";
import { pipelineRender } from "./pipeline";
import { isPlayer, Player } from "../../models/player";
import { Coordinate, getLoadBoundsForCoordinate } from "../../coordinate";
import { GameObject } from "../../game_object";
import { Layer } from "../../types";
import { GRID_INTERVAL, GRID_MAGNITUDE, UNIT_BASE } from "../../common";
import { project } from "../../camera";
import { RenderDictionary } from "../render_dictionary";

export const renderAllObjects = (
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState,
  coordinate: Coordinate,
  tempCtx: CanvasRenderingContext2D,
  renderDictionary: RenderDictionary
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

  const renderShadow = (
    shadow: HTMLCanvasElement,
    renderDictionary: RenderDictionary,
    layer: CoordinateMap<GameObject>,
    renderable: GameObject
  ) => {
    const { x, y } = renderable;
    const { worldX, worldY } = project(gameState.camera, renderable);

    const lowerNeighbor = getAtPath(layer, x, y + 1);

    let shouldBlockShadow = false;
    let shouldShadow = true;

    if (lowerNeighbor) {
      const dictionaryForLowerNeighbor =
        renderDictionary[lowerNeighbor.objectType];

      shouldBlockShadow =
        !!lowerNeighbor?.isStructure && !!dictionaryForLowerNeighbor.shadow;
      shouldShadow =
        !lowerNeighbor.isStructure ||
        (lowerNeighbor.isStructure &&
          (dictionaryForLowerNeighbor.height || 0) <= GRID_INTERVAL);
    }

    if (shouldShadow) {
      const height =
        renderDictionary[renderable.objectType].height || UNIT_BASE;

      const decrement = (height - UNIT_BASE) * GRID_MAGNITUDE;

      tempCtx.save();
      tempCtx.translate(12, decrement + GRID_INTERVAL);
      if (!shouldBlockShadow) {
        tempCtx.transform(1, 0, -0.5, 1, 0, 0);
      } else {
        let width = GRID_INTERVAL / 2;
        for (
          let neighborY = y + 1;
          neighborY <= coordinateBounds.max.y;
          neighborY++
        ) {
          const currentNeighbor = getAtPath(layer, x, neighborY);

          if (currentNeighbor) {
            const dictionaryForLowerNeighbor =
              renderDictionary[currentNeighbor.objectType];

            if (
              currentNeighbor?.isStructure &&
              dictionaryForLowerNeighbor.shadow
            ) {
              const neighborShadowWidth =
                ((dictionaryForLowerNeighbor.height || UNIT_BASE) *
                  GRID_MAGNITUDE) /
                2;

              if (neighborShadowWidth > width) {
                width = neighborShadowWidth;
              }
            } else {
              break;
            }
          }
        }
        tempCtx.transform(1, 0, 0, 1, width, 0.2);
      }
      tempCtx.translate(-12, -(decrement + GRID_INTERVAL));
      tempCtx.scale(1.5, 1.5);

      tempCtx.drawImage(shadow, 0, 0);

      bufferCtx.drawImage(tempCtx.canvas, worldX, worldY - decrement);
      tempCtx.restore();

      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
    }
  };

  const renderRowForLayer = (layer: CoordinateMap<GameObject>, y: number) => {
    for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
      const renderable = getAtPath(layer, x, y);

      if (renderable && !isPlayer(renderable)) {
        if (!renderable.groupId || !idsOverlappingPlayer[renderable.groupId]) {
          const { shadow } = renderDictionary[renderable.objectType];
          if (shadow) {
            renderShadow(shadow, renderDictionary, layer, renderable);
          }

          pipelineRender(renderable, bufferCtx, gameState, y, renderDictionary);
        }
      }
    }
  };

  for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
    if (layerVisibility[Layer.GROUND]) {
      renderRowForLayer(groundMap, y);
    }
    if (layerVisibility[Layer.PASSIVE]) {
      renderRowForLayer(passiveMap, y);
    }
  }

  playersArray.forEach((player) => {
    renderShadow(
      renderDictionary["Player"].shadow as HTMLCanvasElement,
      renderDictionary,
      gameState.layerMaps.interactiveMap,
      player
    );
    pipelineRender(player, bufferCtx, gameState, player.y, renderDictionary);
  });

  for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
    if (layerVisibility[Layer.INTERACTIVE]) {
      renderRowForLayer(interactiveMap, y);
    }

    if (layerVisibility[Layer.OVERHEAD]) {
      renderRowForLayer(overheadMap, y);
    }
  }
};
