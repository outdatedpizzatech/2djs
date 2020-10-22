import { Player } from "../models/player";
import { Coordinate, getLoadBoundsForCoordinate } from "../coordinate";
import { getAtPath } from "../coordinate_map";
import { withinLens } from "../camera";
import { GameState } from "../game_state";
import { DebugArea } from "./types";

export const updateObjectsInView = (params: {
  gameState: GameState;
  coordinate: Coordinate;
  debug: DebugArea;
}) => {
  const { gameState, coordinate, debug } = params;
  const { camera, layerMaps } = gameState;
  const playersArray = Object.values(gameState.players) as Player[];
  const coordinateBounds = getLoadBoundsForCoordinate(coordinate);
  const { interactiveMap, groundMap, passiveMap, overheadMap } = layerMaps;

  let objectsInView = 0;

  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      const renderable = getAtPath(groundMap, x, y);
      if (renderable) {
        if (withinLens(camera, renderable)) objectsInView++;
      }
    }
  }
  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      const renderable = getAtPath(passiveMap, x, y);
      if (renderable) {
        if (withinLens(camera, renderable)) objectsInView++;
      }
    }
  }
  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      const renderable = getAtPath(interactiveMap, x, y);
      if (renderable) {
        if (withinLens(camera, renderable)) objectsInView++;
      }
    }
  }
  for (let x = coordinateBounds.min.x; x <= coordinateBounds.max.x; x++) {
    for (let y = coordinateBounds.min.y; y <= coordinateBounds.max.y; y++) {
      const renderable = getAtPath(overheadMap, x, y);
      if (renderable) {
        if (withinLens(camera, renderable)) objectsInView++;
      }
    }
  }

  objectsInView += playersArray.filter((player) => withinLens(camera, player))
    .length;
  debug.objects.innerText = `Rendered Objects: ${objectsInView}`;
};
