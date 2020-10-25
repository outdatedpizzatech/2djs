import { Camera, CAMERA_HEIGHT, CAMERA_WIDTH, offset } from "../camera";
import sprites from "../sprite_collections/grass_sprite_collection";
import { GRID_INTERVAL } from "../common";

const groundTempCanvas = document.createElement("canvas");
groundTempCanvas.width = GRID_INTERVAL;
groundTempCanvas.height = GRID_INTERVAL;
const tempContext = groundTempCanvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

export const renderGround = (
  bufferCtx: CanvasRenderingContext2D,
  camera: Camera
) => {
  tempContext.drawImage(sprites[0], 0, 0, GRID_INTERVAL, GRID_INTERVAL);

  let { worldX: cameraX, worldY: cameraY } = offset(camera);

  const groundOffsetX = cameraX - CAMERA_WIDTH / 2;
  const groundOffsetY = cameraY - CAMERA_HEIGHT / 2;

  bufferCtx.fillStyle = bufferCtx.createPattern(
    groundTempCanvas,
    "repeat"
  ) as CanvasPattern;

  const modX = groundOffsetX % CAMERA_WIDTH;
  const modY = groundOffsetY % CAMERA_HEIGHT;
  const formulaX = modX - (CAMERA_WIDTH * Math.abs(modX)) / modX;
  const formulaY = modY - (CAMERA_HEIGHT * Math.abs(modY)) / modY;

  bufferCtx.fillRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

  bufferCtx.translate(modX, modY);
  bufferCtx.fillRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
  bufferCtx.translate(-modX, -modY);

  if (modX != 0) {
    bufferCtx.translate(formulaX, modY);
    bufferCtx.fillRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    bufferCtx.translate(-formulaX, -modY);
  }

  if (modY != 0) {
    bufferCtx.translate(modX, formulaY);
    bufferCtx.fillRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    bufferCtx.translate(-modX, -formulaY);
  }

  if (modY !== 0 && modX !== 0) {
    bufferCtx.translate(formulaX, formulaY);
    bufferCtx.fillRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    bufferCtx.translate(-formulaX, -formulaY);
  }
};
