import { combineLatest } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import { GameState } from "../game_state";
import { updateDebugger } from "../debug/debugger_reducer";
import { updateCameraPosition } from "../reducers/camera_reducer";
import { CoordinateMap } from "../coordinate_map";
import { GameObject } from "../game_object";
import { Layer } from "../types";
import { cameraFactory } from "../camera";
import { gameStateSubject$ } from "./subjects";
import { layerVisibilitySubject$, selectedGroupUuid$ } from "../debug/signals";

const camera = cameraFactory({
  x: 0,
  y: 0,
});

const initialGameState: GameState = {
  myClientId: "",
  camera,
  layerMaps: {
    interactiveMap: {} as CoordinateMap<GameObject>,
    groundMap: {} as CoordinateMap<GameObject>,
    overheadMap: {} as CoordinateMap<GameObject>,
    passiveMap: {} as CoordinateMap<GameObject>,
  },
  players: {},
  debug: {
    layerVisibility: {
      [Layer.INTERACTIVE]: true,
      [Layer.PASSIVE]: true,
      [Layer.GROUND]: true,
      [Layer.OVERHEAD]: true,
    },
    selectedGroupId: null,
  },
};

export const gameState$ = combineLatest([
  gameStateSubject$,
  layerVisibilitySubject$.pipe(
    map(({ layer, visible }) => ({ [layer]: visible })),
    startWith(initialGameState.debug.layerVisibility)
  ),
  selectedGroupUuid$,
]).pipe(
  map(([gameState, debugLayer, selectedGroupId]) => ({
    gameState,
    debugLayer,
    selectedGroupId,
  })),
  scan((acc: GameState, { gameState, debugLayer, selectedGroupId }) => {
    updateDebugger(gameState, debugLayer, selectedGroupId);
    updateCameraPosition(gameState);

    return gameState;
  }, initialGameState),
  startWith(initialGameState)
);
