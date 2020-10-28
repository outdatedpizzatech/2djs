import { GameState } from "../game_state";

export const updateDebugger = (
  gameState: GameState,
  debugLayer: { [key: number]: boolean },
  selectedGroupUuid: string
) => {
  Object.assign(gameState.debug.layerVisibility, debugLayer);
  gameState.debug.selectedGroupId = selectedGroupUuid;
};
