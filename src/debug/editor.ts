import { gameStateSubject$, selectedGroupUuidSubject$ } from "../signals";
import { CoordinateMap, getAtPath, LayerMaps } from "../coordinate_map";
import { GameObject } from "../game_object";
import { treeFactory } from "../models/tree";
import { wallFactory } from "../models/wall";
import axios from "axios";
import { API_URI_BASE } from "../common";
import {
  addObjectToMap,
  removeObjectFromMap,
  updateObjectInMap,
} from "../reducers/map_reducer";
import { Layer, Unsaved } from "../types";
import { GameState } from "../game_state";
import { streetFactory } from "../models/street";
import { GameObjectType } from "./debugger";
import { doorFactory } from "../models/door";
import { emptyFactory } from "../models/empty";
import { houseFloorFactory } from "../models/house_floor";
import { houseWallFactory, HouseWallRole } from "../models/house_wall";
import { roofFactory } from "../models/roof";
import { waterFactory } from "../models/water";

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
  selectedObject: GameObjectType;
}) => {
  const { gameState, x, y, selectedObject } = params;

  const objectToFactoryMap: { [K in GameObjectType]: Unsaved<GameObject> } = {
    tree: treeFactory({ x, y }),
    wall: wallFactory({ x, y }),
    street: streetFactory({ x, y }),
    door: doorFactory({ x, y }),
    empty: emptyFactory({ x, y }),
    house_floor: houseFloorFactory({ x, y }),
    house_wall_front: houseWallFactory({ x, y, role: HouseWallRole.FRONT }),
    house_wall_side: houseWallFactory({ x, y, role: HouseWallRole.SIDE }),
    roof: roofFactory({ x, y }),
    water: waterFactory({ x, y }),
  };

  const gameObject = objectToFactoryMap[selectedObject];

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

  if (!layerMap || layer == null) {
    return;
  }

  if (!retrieved) {
    return;
  }

  const result = await axios.delete(
    `${API_URI_BASE}/game_objects/${retrieved._id}`
  );

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

export const getGroup = async (params: {
  x: number;
  y: number;
  gameState: GameState;
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

  if (!layerMap || layer == null) {
    return;
  }

  if (!retrieved) {
    return;
  }

  selectedGroupUuidSubject$.next(retrieved.groupId);
};

export const setGroup = async (params: {
  x: number;
  y: number;
  gameState: GameState;
  groupId: string;
}) => {
  const { gameState, x, y, groupId } = params;

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

  if (!layerMap || layer == null) {
    return;
  }

  if (!retrieved) {
    return;
  }

  const result = await axios.patch(
    `${API_URI_BASE}/game_objects/${retrieved._id}`,
    { groupId }
  );

  if (result.status == 204) {
    gameStateSubject$.next(
      updateObjectInMap(
        {
          gameState,
          x,
          y,
          layer,
        },
        { groupId }
      )
    );
  }
};