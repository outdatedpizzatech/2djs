import { map } from "rxjs/operators";
import { GRID_INTERVAL, UNIT_BASE } from "../common";
import { GameState } from "../game_state";
import { offset } from "../camera";

export const withSnapping = (gridCanvas: HTMLCanvasElement) =>
  map((event: MouseEvent) => {
    const boundingRect = gridCanvas.getBoundingClientRect();
    const x = event.x - boundingRect.x;
    const y = event.y - boundingRect.y;
    const snapX = Math.floor(x / GRID_INTERVAL) * GRID_INTERVAL;
    const magicYOffset = GRID_INTERVAL - UNIT_BASE + UNIT_BASE / 4;
    const snapY = Math.floor(y / GRID_INTERVAL) * GRID_INTERVAL + magicYOffset;
    return { x: snapX, y: snapY };
  });

export const withNormalizedCoordinate = map(
  (params: { gameState: GameState; x: number; y: number }) => {
    const { gameState, x, y } = params;
    const { camera } = gameState;
    const { worldX, worldY } = offset(camera);
    return {
      x: (x - worldX) / GRID_INTERVAL,
      y: (y - worldY) / GRID_INTERVAL,
    };
  }
);
