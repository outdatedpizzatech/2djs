import { gameStateSubject$ } from "../signals";
import { CoordinateMap, getAtPath, LayerMaps } from "../coordinate_map";
import { GameObject } from "../game_object";
import { treeFactory } from "../models/tree";
import { wallFactory } from "../models/wall";
import axios from "axios";
import { API_URI_BASE } from "../common";
import { addObjectToMap, removeObjectFromMap } from "../reducers/map_reducer";
import { Layer } from "../types";
import { GameState } from "../game_state";
import { streetFactory } from "../models/street";

const getLayerMapFromLayer = (layer: Layer, layerMaps: LayerMaps) => {
  if (layer == Layer.INTERACTIVE) {
    return layerMaps.interactiveMap;
  }
  if (layer == Layer.GROUND) {
    return layerMaps.groundMap;
  }
  if (layer == Layer.PASSIVE) {
    return layerMaps.passiveMap;
  }

  return layerMaps.overheadMap;
};

export const addObject = async (params: {
  x: number;
  y: number;
  gameState: GameState;
  selectedObject: string;
}) => {
  const { gameState, x, y, selectedObject } = params;

  let gameObject: Omit<GameObject, "_id"> | null = null;

  if (selectedObject == "tree") {
    gameObject = treeFactory({
      x,
      y,
    });
  } else if (selectedObject == "wall") {
    gameObject = wallFactory({
      x,
      y,
    });
  } else if (selectedObject == "street") {
    gameObject = streetFactory({
      x,
      y,
    });
  }

  if (!gameObject) {
    return;
  }

  const layerMap = getLayerMapFromLayer(gameObject.layer, gameState.layerMaps);

  const retrieved = getAtPath(layerMap, x, y);

  if (retrieved) {
    return;
  }

  const result = await axios.post(`${API_URI_BASE}/game_objects`, gameObject);

  const savedObject: GameObject = { ...gameObject, _id: result.data._id };

  if (result.status == 201) {
    gameStateSubject$.next(
      addObjectToMap({
        gameState,
        gameObject: savedObject,
      })
    );
  }
};

export const removeObject = async (params: {
  gameState: GameState;
  x: number;
  y: number;
}) => {
  const { gameState, x, y } = params;

  let retrieved: GameObject | null = null;
  let layerMap: CoordinateMap<GameObject> | null = null;
  let layer: Layer | null = null;

  if (gameState.debug.layerVisibility[Layer.OVERHEAD]) {
    layer = Layer.OVERHEAD;
    layerMap = layerMap = gameState.layerMaps.overheadMap;
    retrieved = getAtPath(layerMap, x, y);
  }

  if (!retrieved && gameState.debug.layerVisibility[Layer.INTERACTIVE]) {
    layer = Layer.INTERACTIVE;
    layerMap = layerMap = gameState.layerMaps.interactiveMap;
    retrieved = getAtPath(layerMap, x, y);
  }

  if (!retrieved && gameState.debug.layerVisibility[Layer.PASSIVE]) {
    layer = Layer.PASSIVE;
    layerMap = layerMap = gameState.layerMaps.passiveMap;
    retrieved = getAtPath(layerMap, x, y);
  }

  if (!retrieved && gameState.debug.layerVisibility[Layer.GROUND]) {
    layer = Layer.GROUND;
    layerMap = layerMap = gameState.layerMaps.groundMap;
    retrieved = getAtPath(layerMap, x, y);
  }

  console.log("wut");
  console.log(retrieved);
  console.log(layer);
  console.log(layerMap);

  if (!layerMap || layer == null) {
    return;
  }

  if (!retrieved) {
    return;
  }

  const result = await axios.delete(
    `${API_URI_BASE}/game_objects/${retrieved._id}`
  );

  console.log("removing object from ", layer);

  if (result.status == 204) {
    gameStateSubject$.next(
      removeObjectFromMap({
        gameState,
        x,
        y,
        layer,
      })
    );
  }
};
