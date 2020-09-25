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

  bufferCtx.translate(groundOffsetX, groundOffsetY);
  bufferCtx.fillRect(0, 0, CAMERA_WIDTH * 2, CAMERA_HEIGHT * 2);
  bufferCtx.translate(-groundOffsetX, -groundOffsetY);
};
