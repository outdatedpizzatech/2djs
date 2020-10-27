import { frameWithGameState$, gameStateSubject$ } from "../signals";
import { cloneDeep } from "../clone_deep";
import { updateCameraPosition } from "../reducers/camera_reducer";

export const addCameraSubscriptions = () => {
  frameWithGameState$.subscribe(({ gameState }) => {
    let newGameState = cloneDeep(gameState);
    newGameState = updateCameraPosition(newGameState);
    gameStateSubject$.next(newGameState);
  });
};
