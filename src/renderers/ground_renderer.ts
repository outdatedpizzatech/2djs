import { Camera, CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";
import sprites from "../sprite_collections/grass_sprite_collection";

export const renderGround = (
  bufferCtx: CanvasRenderingContext2D,
  camera: Camera
) => {
  let { worldX: cameraX, worldY: cameraY } = camera.offset();

  const groundOffsetX = cameraX - CAMERA_WIDTH / 2;
  const groundOffsetY = cameraY - CAMERA_HEIGHT / 2;

  bufferCtx.fillStyle = bufferCtx.createPattern(
    sprites[0],
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
